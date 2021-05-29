<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">
      <div class="pic-404">
        <img
          class="pic-404__parent"
          src="https://raw.githubusercontent.com/PanJiaChen/vue-element-admin/master/src/assets/404_images/404.png"
          alt="404"
        >
        <img
          class="pic-404__child left"
          src="https://raw.githubusercontent.com/PanJiaChen/vue-element-admin/master/src/assets/404_images/404_cloud.png"
          alt="404"
        >
        <img
          class="pic-404__child mid"
          src="https://raw.githubusercontent.com/PanJiaChen/vue-element-admin/master/src/assets/404_images/404_cloud.png"
          alt="404"
        >
        <img
          class="pic-404__child right"
          src="https://raw.githubusercontent.com/PanJiaChen/vue-element-admin/master/src/assets/404_images/404_cloud.png"
          alt="404"
        >
      </div>
      <div class="bullshit">
        <div class="bullshit__oops">OOPS!</div>
        <div
          class="bullshit__headline"
        >You are using {{ browserName }} version {{ browserVersion }} currently not supporting the Estimated Shipping application</div>
        <div class="bullshit__info">
          <p v-if="isBrowserSupported && isThereAvailableVersion">
            <span>Please upgrade to version</span>
            <a
              style="color:#20a0ff"
              :href="browserUpgradeUrl"
              target="_blank"
            >{{ availableBrowserVersion }}</a>
            <span>or later for the best experience, or use one of the supported browsers below:</span>
          </p>
          <p v-else>Please use one of the supported browsers below:</p>
          <ul class="bullshit__info__list">
            <li
              class="bullshit__info__list__item"
              v-for="browser in listAvailableBrowsers"
              :key="browser.name"
            >
              <span>{{ browser.name }}: {{ browser.minimum_version }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: "Page404",
  computed: {
    browser() {
      return window.browser;
    },
    browserName() {
      return this.browser.detail.name;
    },
    browserVersion() {
      return this.browser.detail.version;
    },
    listBrowsers() {
      return this.browser.listBrowsers;
    },
    listAvailableBrowsers() {
      return this.listBrowsers.filter(browser => browser.is_support);
    },
    availableBrowser() {
      let browser = this.listBrowsers.find(
        browser => browser.name === this.browserName
      );
      return browser;
    },
    isThereAvailableVersion() {
      return !!this.availableBrowser;
    },
    isBrowserSupported() {
      return this.availableBrowser ? this.availableBrowser.is_support : false;
    },
    availableBrowserVersion() {
      return this.availableBrowser
        ? this.availableBrowser.minimum_version
        : null;
    },
    browserUpgradeUrl() {
      return this.availableBrowser ? this.availableBrowser.upgrade_url : null;
    }
  }
};
</script>

<style scoped>
.wscn-http404-container {
  max-width: 800px;
  margin-top: 30px;
  margin: auto;
}
.wscn-http404 {
  display: flex;
}
.wscn-http404 .pic-404 {
  position: relative;
  width: 400px;
  overflow: hidden;
  padding-top: 80px;
}

@media (max-width: 800px) {
  .wscn-http404 .pic-404 {
    display: none;
  }
}

.wscn-http404 .bullshit {
  flex: 1;
  padding: 30px;
  overflow: hidden;
}

.wscn-http404 .pic-404__parent {
  width: 100%;
}
.wscn-http404 .pic-404__child {
  position: absolute;
}
.wscn-http404 .pic-404__child.left {
  width: 80px;
  top: 17px;
  left: 220px;
  opacity: 0;
  animation-name: cloudLeft;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  animation-delay: 1s;
}
.wscn-http404 .pic-404__child.mid {
  width: 46px;
  top: 10px;
  left: 420px;
  opacity: 0;
  animation-name: cloudMid;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  animation-delay: 1.2s;
}
.wscn-http404 .pic-404__child.right {
  width: 62px;
  top: 100px;
  left: 500px;
  opacity: 0;
  animation-name: cloudRight;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  animation-delay: 1s;
}
@keyframes cloudLeft {
  0% {
    top: 17px;
    left: 220px;
    opacity: 0;
  }
  20% {
    top: 33px;
    left: 188px;
    opacity: 1;
  }
  80% {
    top: 81px;
    left: 92px;
    opacity: 1;
  }
  100% {
    top: 97px;
    left: 60px;
    opacity: 0;
  }
}
@keyframes cloudMid {
  0% {
    top: 10px;
    left: 420px;
    opacity: 0;
  }
  20% {
    top: 40px;
    left: 360px;
    opacity: 1;
  }
  70% {
    top: 130px;
    left: 180px;
    opacity: 1;
  }
  100% {
    top: 160px;
    left: 120px;
    opacity: 0;
  }
}
@keyframes cloudRight {
  0% {
    top: 100px;
    left: 500px;
    opacity: 0;
  }
  20% {
    top: 120px;
    left: 460px;
    opacity: 1;
  }
  80% {
    top: 180px;
    left: 340px;
    opacity: 1;
  }
  100% {
    top: 200px;
    left: 300px;
    opacity: 0;
  }
}

.wscn-http404 .bullshit__oops {
  font-size: 32px;
  font-weight: bold;
  line-height: 40px;
  color: #1482f0;
  opacity: 0;
  margin-bottom: 20px;
  animation-name: slideUp;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}
.wscn-http404 .bullshit__headline {
  font-size: 20px;
  line-height: 24px;
  color: #222;
  font-weight: bold;
  opacity: 0;
  margin-bottom: 10px;
  animation-name: slideUp;
  animation-duration: 0.5s;
  animation-delay: 0.1s;
  animation-fill-mode: forwards;
}
.wscn-http404 .bullshit__info {
  font-size: 13px;
  line-height: 21px;
  color: grey;
  opacity: 0;
  margin-bottom: 30px;
  animation-name: slideUp;
  animation-duration: 0.5s;
  animation-delay: 0.2s;
  animation-fill-mode: forwards;
}
.wscn-http404 .bullshit__return-home {
  display: block;
  float: left;
  width: 110px;
  height: 36px;
  background: #1482f0;
  border-radius: 100px;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 14px;
  line-height: 36px;
  cursor: pointer;
  animation-name: slideUp;
  animation-duration: 0.5s;
  animation-delay: 0.3s;
  animation-fill-mode: forwards;
}

.wscn-http404 .bullshit__info__list {
  list-style: disc;
}

.wscn-http404 .bullshit__info__list .bullshit__info__list__item {
  list-style-type: disc;
  margin: 10px;
}

@keyframes slideUp {
  0% {
    transform: translateY(60px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>

