<p align="center">
    <img width="128" height="128" src="https://github.com/pjpscriv/gmail-label-colorizer/blob/main/src/icons/icon_128.png?raw=true">
</p>
<h1 align="center">Gmail Label Colorizer</h1>

<p align="center">
  <picture>
    <a href="https://chromewebstore.google.com/detail/gmail-label-colorizer/pjainmnpfajfihmlgdbhaigmehlmeikm">
      <img height="58" src="https://github.com/pjpscriv/gmail-label-colorizer/blob/main/docs/links/chrome-webstore.png" alt="Chrome Web Store">
    </a>
  </picture>
  <picture>
    <a href="https://addons.mozilla.org/en-GB/firefox/addon/gmail-label-colorizer/">
      <img height="58" src="https://github.com/pjpscriv/gmail-label-colorizer/blob/main/docs/links/firefox-addon.png" alt="Firefox add-ons">
    </a>
  </picture>
  <!-- </br></brr> -->
</p>

A simple extension for making any-color labels in Gmail.

Modifies the pre-existing "Add custom colour" modal in Gmail to use a simple 
color picker. Automatically sets text to black or white depending on the background.

Currently a very bare-bones v1. If you have any issues or feature requests - 
post them [here](https://github.com/pjpscriv/gmail-label-colorizer/issues).

## Developement

Launch the extension using Mozilla's web-ext

```sh
web-ext run --target chromium --source-dir ./src/
```


### Package

```sh
web-ext build --source-dir ./src/ --artifacts-dir=./dist
```
