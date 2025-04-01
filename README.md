<h1>
    <img width="32" height="32" src="https://github.com/pjpscriv/gmail-label-colorizer/blob/main/src/icons/icon_128.png?raw=true">
    Gmail Label Colorizer
</h1>

<p>
  <picture>
    <a href="https://chromewebstore.google.com/detail/gmail-label-colorizer/pjainmnpfajfihmlgdbhaigmehlmeikm">
      <img src="https://img.shields.io/chrome-web-store/users/pjainmnpfajfihmlgdbhaigmehlmeikm?style=flat-square&logo=google-chrome&logoColor=white&label=Chrome%20users&color=%234285F4" alt="Chrome Web Store">
    </a>
  </picture>
  <picture>
    <a href="https://addons.mozilla.org/en-GB/firefox/addon/gmail-label-colorizer/">
      <img src="https://img.shields.io/amo/users/gmail-label-colorizer?style=flat-square&logo=firefox&logoColor=white&label=Firefox%20users&color=%23FF7139" alt="Firefox add-ons">
    </a>
  </picture>
  <!-- </br></brr> -->
</p>

A simple extension for making any-color labels in Gmail. 

Modifies the pre-existing "Add custom colour" modal in Gmail to use a simple 
color picker. Automatically sets text to black or white depending on the background.

Post any issues or feature requests [here](https://github.com/pjpscriv/gmail-label-colorizer/issues).

## Developement

Launch the extension using Mozilla's web-ext

```sh
web-ext run --target chromium --source-dir ./src/
```


### Package

```sh
web-ext build --source-dir ./src/ --artifacts-dir=./dist
```
