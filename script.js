<script>
  window.SUBSCRIBER_IDS = [
    'qiy8iac',
    'ti78iq',
    // add your subscriber list here. you can remove above example.
  ]
  window.AUTZORG_APP_ID = 'qimw2iq' // update this with your actual app id

  window.MEMBERSHIP_CONFIG = {
    memberOnlyKey: 'member-only',
    memberOnlyAlert: 'This is member only article. Please login first.',
    subscribeFirstAlert: 'Your account has not been included in the member list. Please click the link to subscribe.',
    subscribeLink: '/p/subscribe.html',
  }
</script>
<script>
  let prevDisplay = ''
  const postBody = document.querySelector('.post-body');
  if (postBody) {
    prevDisplay = postBody.style.display
    if (prevDisplay == 'none') {
      prevDisplay = 'unset'
    }
  }

  const isArticlePage = () => {
    const pattern = /^\/\d{4}\/\d{2}\/[a-zA-Z0-9-]+\.html$/;
    return pattern.test(location.pathname)
  }

  const isMemberOnlyPage = () => {
    if (!postBody) {
      return false
    }
    if (!postBody.textContent.toLowerCase().includes(window.MEMBERSHIP_CONFIG.memberOnlyKey)) {
      return false
    }

    return true
  }

  async function main() {
    window.autz = new Autzorg(window.AUTZORG_APP_ID)
    await autz.check()
    if (autz.error) {
      console.error('Autz error:', autz.error)
    }
    showLoggedIn(autz.user)

    setTimeout(() => {
      const logout = document.getElementById("autzLogout");
      if (logout && !logout.dataset.listenerAttached) {
        logout.addEventListener("click", () => {
          autz.logout()
          location.reload()
        });
        logout.dataset.listenerAttached = "true";
      }
      const login = document.getElementById("autzLogin");
      if (login && !login.dataset.listenerAttached) {
        login.addEventListener("click", () => {
          location.href = autz.loginURL
        });
        login.dataset.listenerAttached = "true";
      }
    }, 1000);

    if (!isMemberOnlyPage()) {
      postBody.style.display = prevDisplay
      return
    }

    if (!autz.isLogin) {
      postBody.innerHTML = `${window.MEMBERSHIP_CONFIG.memberOnlyAlert} <a href="${autz.loginURL}">Login</a>`
      postBody.style.display = prevDisplay
      return
    }

    if (!window.SUBSCRIBER_IDS.includes(autz.user.id)) {
      postBody.innerHTML = `${window.MEMBERSHIP_CONFIG.subscribeFirstAlert} <a href="${window.MEMBERSHIP_CONFIG.subscribeLink}" target="_blank">Click here</a>`
      postBody.style.display = prevDisplay
      return
    }
    postBody.style.display = prevDisplay
  }

  function showLoggedIn(user) {
    setTimeout(() => {
      const el = document.querySelector('#autzBox')
      document.body.appendChild(el);
      if (!user) {
        document.querySelector('#autzBox #isGuest').style.display = 'unset'
        return
      }

      document.querySelector('#autzBox #userName').innerText = user.name
      document.querySelector('#autzBox #userID').innerText = user.id
      document.querySelector('#autzBox #isLogin').style.display = 'unset'
    }, 500)
  }

  function onMounted() {
    if (postBody && !isMemberOnlyPage() && isArticlePage()) {
      postBody.style.display = 'none'
    }
    const autzInterval = setInterval(() => {
      if (window.Autzorg) {
        main()
        clearInterval(autzInterval)
      }
      console.log('waiting Autzorg');
    }, 200)
  }

  onMounted()
</script>
<script src="https://autz.org/sdk.js"></script>
<div id="autzBox">
  <div id="isLogin" style="display:none;">
    <span id="userName"></span> (User ID: <span id="userID"></span>).
    <a href="javascript:;" id="autzLogout">Logout</a>
  </div>
  <div id="isGuest" style="display:none;">
    You are not logged in.
    <a href="javascript:;" id="autzLogin">Login</a>
  </div>
</div>
<style>
  #autzBox {
    position: fixed;
    bottom: 0;
    text-align: center;
    background-color: white;
    box-shadow: 0px 0px 15px 5px grey;
    padding: 0.5rem;
    z-index: 1000;
    border: 1px solid;
    left: 50%;
    transform: translate(-50%, 0);
    width: 100%;
  }
  #autzBox.dark {
    background-color: black;
    color: white;
  }
</style>
