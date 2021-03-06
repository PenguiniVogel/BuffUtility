## BuffUtility V2

Get it for:
* Chrome [here](https://chrome.google.com/webstore/detail/buff-utility/gfjnmalnjjmjahaddeaamlkeliginpaf)
* Firefox [here](https://addons.mozilla.org/en-US/firefox/addon/buff-utility/)
* Or run it unpacked via release [here](https://github.com/PenguiniVogel/BuffUtility/releases/latest)

**The settings and what they do:**

* Display Currency
  * Changes the display currency
* Apply Currency to difference
  * Whether to show the difference on the listing page in your selected currency or RMB.

Setting **ON** <br>
![Apply Currency to difference ON](docs/resources/setting_display/Apply%20Currency%20to%20difference%20ON.jpg) <br>
Setting **OFF** <br>
![Apply Currency to difference OFF](docs/resources/setting_display/Apply%20Currency%20to%20difference%20OFF.jpg)

* Can expand preview
  * Can previews be expanded on sell listings. This only works if 'Preview screenshots' is turned on and if the item has been inspected.
  
Setting **ON** <br>
![Can expand preview ON](docs/resources/setting_display/Can%20expand%20preview%20ON.jpg) <br>
Setting **OFF** <br>
Well *nothing* happens when you hover the preview image.

* Expanded preview backdrop
  * Adds a transparent black backdrop to preview images to add some contrast.

Setting **ON** <br>
*Note the slightly transparent black background* <br>
![Can expand preview ON](docs/resources/setting_display/Can%20expand%20preview%20ON.jpg) <br>
Setting **OFF** <br>
![Expanded preview backdrop OFF](docs/resources/setting_display/Expanded%20preview%20backdrop%20OFF.jpg)

* Apply Steam Tax
  * Apply Steam Tax before calculating differences.
    This will calculate the steam seller price from the provided reference price.
* Show Toast on action
  * If enabled, respective components will inform you via Buffs Toast system
* Listing Options
  * Define what options show up on each listing

Setting **ALL ENABLED** <br>
![Listing Options ALL](docs/resources/setting_display/Listing%20Options%20ALL.jpg) <br>
Setting **CONFIGURED** <br>
*In this example I only have `Copy !gen/!gengl` and `Share` configured.* <br>
![Listing Options CONFIGURED](docs/resources/setting_display/Listing%20Options%20CONFIGURED.jpg)

* Show float-bar
  * Show the float-bar buff has on the side, can be expanded back if hidden!
* Color purchase options
  * Color purchase options, this will paint purchase options red if not affordable with the current held balance.

Example: <br>
![Color purchase options SET](docs/resources/setting_display/Color%20purchase%20options%20SET.jpg) <br>

* Difference Dominator
  * Specify the dominator meaning: <br>
    Steam: `(steam_market_price - buff_price) / steam_market_price` <br>
    Buff: `(steam_market_price - buff_price) / buff_price` <br>
    Unless you know the difference might not want to change this setting.
* Default sort by
  * Default sort by for item listings <br>
    Default: Default <br>
    Newest: Newest <br>
    Price Ascending: low to high <br>
    Price Descending: high to low <br>
    Float Ascending: low to high <br>
    Float Descending: high to low <br>
    Hot Descending: by heat..?
* Default sticker search
  * Search listings with sticker settings automatically
* Expand preview type
  * Either expand into a zoomed preview image or expand into the inspect image.
* Custom FOP
  * Set the factor (or field) of preview, you should ***not*** change this to anything but `Auto`.
* Custom currency rate
  * Set the rate of the custom currency e.g. <br>
    10 RMB -> 1 CC <br>
    Only active if `Custom` was selected in the `Display Currency` option.
* Custom currency name
  * Set the name of the custom currency. Only active if `Custom` was selected in the `Display Currency` option.
* Data protection
  * Blur some settings on the account page to protect yourself

---

Thank you:
* Futeish
    * For making me an awesome new extension icon!
* Scarlet
    * For suggesting the screenshot expansion
* Arceus
    * For correcting my wrong difference calculations
* All of you users who contribute by making suggestions or reporting issues!
