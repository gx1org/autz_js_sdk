window.autzDataToToken = (d) => {
  const _0xc3a0ed = _0x35b8; (function (_0x10405e, _0x5754b6) { const _0x562029 = _0x35b8, _0x4965dd = _0x10405e(); while (!![]) { try { const _0x4ca034 = parseInt(_0x562029(0x1f2)) / 0x1 + -parseInt(_0x562029(0x1f6)) / 0x2 + parseInt(_0x562029(0x1f7)) / 0x3 + parseInt(_0x562029(0x1f0)) / 0x4 * (parseInt(_0x562029(0x1f1)) / 0x5) + parseInt(_0x562029(0x1f8)) / 0x6 + parseInt(_0x562029(0x1f4)) / 0x7 + parseInt(_0x562029(0x1f5)) / 0x8 * (-parseInt(_0x562029(0x1f3)) / 0x9); if (_0x4ca034 === _0x5754b6) break; else _0x4965dd['push'](_0x4965dd['shift']()); } catch (_0x4f0dde) { _0x4965dd['push'](_0x4965dd['shift']()); } } }(_0x1d1b, 0x82ccb)); const t = btoa(JSON['stringify'](d)), s = btoa(Math[_0xc3a0ed(0x1ef)]())[_0xc3a0ed(0x1ee)](0x0, 0xc); function _0x1d1b() { const _0x32766d = ['4jAUZgp', '565965eIziMk', '629541GQjEsL', '4230918buZhun', '3928351ERempc', '24SynHBN', '1399340crktGR', '2956275vWqerX', '2138274kRgxaK', 'slice', 'random']; _0x1d1b = function () { return _0x32766d; }; return _0x1d1b(); } function _0x35b8(_0x42e71f, _0x51844c) { const _0x1d1b31 = _0x1d1b(); return _0x35b8 = function (_0x35b8d6, _0x9df794) { _0x35b8d6 = _0x35b8d6 - 0x1ee; let _0x4f22c1 = _0x1d1b31[_0x35b8d6]; return _0x4f22c1; }, _0x35b8(_0x42e71f, _0x51844c); } return s + t;
}

window.autzTokenToData = (t) => {
  var _0x42183f = _0x1905; function _0x1905(_0x14d3c7, _0x34e0c7) { var _0x5edcea = _0x5edc(); return _0x1905 = function (_0x190566, _0x5e0047) { _0x190566 = _0x190566 - 0xc9; var _0x27a5f9 = _0x5edcea[_0x190566]; return _0x27a5f9; }, _0x1905(_0x14d3c7, _0x34e0c7); } (function (_0x4f198d, _0x3b38e6) { var _0x38e8fa = _0x1905, _0x188cf6 = _0x4f198d(); while (!![]) { try { var _0xa4b814 = -parseInt(_0x38e8fa(0xcc)) / 0x1 + parseInt(_0x38e8fa(0xd1)) / 0x2 + -parseInt(_0x38e8fa(0xcd)) / 0x3 + parseInt(_0x38e8fa(0xd0)) / 0x4 + -parseInt(_0x38e8fa(0xd2)) / 0x5 + -parseInt(_0x38e8fa(0xce)) / 0x6 * (parseInt(_0x38e8fa(0xc9)) / 0x7) + -parseInt(_0x38e8fa(0xca)) / 0x8 * (-parseInt(_0x38e8fa(0xcb)) / 0x9); if (_0xa4b814 === _0x3b38e6) break; else _0x188cf6['push'](_0x188cf6['shift']()); } catch (_0x208263) { _0x188cf6['push'](_0x188cf6['shift']()); } } }(_0x5edc, 0x537f5)); function _0x5edc() { var _0x158cc0 = ['594230TwXbLJ', '1522880JNcVKp', 'Invalid\x20token', 'parse', '7xTLXop', '48qlNkfR', '507357UJFKIT', '144642dYnKrs', '393303saJGhk', '117090rbGKhn', 'slice', '1225944qSWJEf']; _0x5edc = function () { return _0x158cc0; }; return _0x5edc(); } try { return t = t[_0x42183f(0xcf)](0xc), JSON[_0x42183f(0xd4)](atob(t)); } catch (_0x206ed2) { throw _0x42183f(0xd3); }
}

class AutzorgClass {
  appID;
  isLogin = false;
  user = null;
  status = 'pending';
  error = '';

  constructor(appID) {
    this.appID = appID
  }

  get loginURL() {
    return `https://autz.org/onboarding/${autzorgAppID}?callback_url=${location.href}`
  }

  async check() {
    this.status = 'checking'
    await this.detectURL()
  }

  async detectURL() {
    const usp = new URLSearchParams(location.search)
    const code = usp.get('auth_code');
    if (!code) return this.detectStorage();
    window.history.replaceState({}, document.title, location.pathname)
    const [token, err] = await this.authenticateCode(this.appID, code)
    if (err) {
      this.error = err
      this.status = 'err_authenticateCode'
      return false
    }

    localStorage.setItem('token', token)
    return this.detectStorage()
  }

  detectStorage() {
    const token = localStorage.getItem('token') || ''
    const [user, err] = this.parseToken(token)
    if (err) {
      this.error = err
      this.status = 'err_parseToken'
      return false
    }

    this.user = user
    this.isLogin = Boolean(this.user)
    this.status = 'done'
    return true
  }

  logout() {
    localStorage.removeItem('token')
    this.isLogin = false
    this.user = null
  }

  async authenticateCode(appID, code) {
    const autzClientApi = `https://autz.org/api/client/${appID}/userinfo?code=${code}`
    const result = await fetch(autzClientApi).then(async r => {
      return await r.json().then(body => {
        if (body.message) {
          return ['', body.message]
        }
        const next7Days = new Date().getTime() + (1000 * 3600 * 24 * 7)
        const data = {
          id: body.user.id,
          name: body.user.name,
          email: body.user.email,
          exp: next7Days,
        }
        const token = window.autzDataToToken(data)
        return [token, '']
      })
    })
      .catch(e => {
        return ['', 'Something went wrong. Please check developer tool console panel']
      })
    return result
  }

  parseToken(token) {
    if (!token) {
      return [null, '']
    }
    try {
      const data = window.autzTokenToData(token)
      const now = new Date().getTime()
      if (now > data.exp) {
        return [null, 'Token expired']
      }
      delete data.exp
      return [data, '']
    } catch (e) {
      return [null, String(e)]
    }
  }
}

window.Autzorg = AutzorgClass
