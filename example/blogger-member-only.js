<script>
  window.SUBSCRIBER_IDS = [
    'qiny8iac',
    'ti78ciq',
  ]
  window.AUTZORG_APP_ID = 'qinw2is'
  </script>
  <script src="https://cdn.jsdelivr.net/gh/gx1org/autz_js_sdk/script.js"></script>
  <script>
    const postBodySelector = '.post-body'
    const memberOnlyKey = 'member-only'
    const memberOnlyAlert = 'Artikel ini hanya bisa diakses oleh member. Silakan login terlebih dahulu.'
    const subscribeFirstAlert = 'Akun Anda belum tercatat sebagai member. Silakan klik link untuk berlangganan.'
    const subscribeLink = '/p/subscribe.html'
    let prevDisplay = ''
    const pattern = /^\/\d{4}\/\d{2}\/[a-zA-Z0-9-]+\.html$/;
    const isArticlePage = () => {
      return pattern.test(location.pathname)
    }
    const postBody = document.querySelector(postBodySelector);
    if (postBody) {
      prevDisplay = postBody.style.display
    }
  
    const isMemberOnlyPage = () => {
      if (!postBody) {
        return false
      }
      if (!postBody.textContent.toLowerCase().includes(memberOnlyKey)) {
        return false
      }
  
      return true
    }
  
    if (postBody && !isMemberOnlyPage() && isArticlePage()) {
      postBody.style.display = 'none'
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
        postBody.innerHTML = `${memberOnlyAlert} <a href="${autz.loginURL}">Login</a>`
        postBody.style.display = prevDisplay
        return
      }
  
      if (!window.SUBSCRIBER_IDS.includes(autz.user.id)) {
        postBody.innerHTML = `${subscribeFirstAlert} (User ID: <b>${autz.user.id}</b>) <a href="${subscribeLink}" target="_blank">Click here</a>`
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
        document.querySelector('#autzBox #isLogin').style.display = 'unset'
      }, 500)
    }
  
    const autzInterval = setInterval(() => {
      if (window.Autzorg) {
        main()
        clearInterval(autzInterval)
      }
      console.log('waiting Autzorg');
    }, 200)
  </script>
  <div id="autzBox" style="position: fixed;bottom: 0;text-align: center;background-color: white;box-shadow: 3px;opacity: 0.8;padding: 0.5rem;z-index: 1000;border: 1px solid;right: 0;">
    <div id="isLogin" style="display:none;">
      You are logged in as: <span id="userName"></span>.
      <a href="javascript:;" id="autzLogout">Logout</a>
    </div>
    <div id="isGuest" style="display:none;">
      You are not logged in.
      <a href="javascript:;" id="autzLogin">Login</a>
    </div>
  </div>
