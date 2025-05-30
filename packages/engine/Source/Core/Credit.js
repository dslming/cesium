import DOMPurify from "dompurify";
import Check from "./Check.js";
import defined from "./defined.js";

let nextCreditId = 0;
const creditToId = {};

/**
 * A credit contains data pertaining to how to display attributions/credits for certain content on the screen.
 * @param {string} html An string representing an html code snippet
 * @param {boolean} [showOnScreen=false] If true, the credit will be visible in the main credit container.  Otherwise, it will appear in a popover. All credits are displayed `inline`, if you have an image we recommend sizing it correctly to match the text or use css to `vertical-align` it.
 *
 * @alias Credit
 * @constructor
 *
 * @exception {DeveloperError} html is required.
 *
 * @example
 * // Create a credit with a tooltip, image and link
 * const credit = new Cesium.Credit('<a href="https://cesium.com/" target="_blank"><img src="/images/cesium_logo.png"  style="vertical-align: -7px" title="Cesium"/></a>');
 */
function Credit(html, showOnScreen) {
  //>>includeStart('debug', pragmas.debug);
  Check.typeOf.string("html", html);
  //>>includeEnd('debug');
  let id;
  const key = html;

  if (defined(creditToId[key])) {
    id = creditToId[key];
  } else {
    id = nextCreditId++;
    creditToId[key] = id;
  }

  showOnScreen = showOnScreen ?? false;

  // Credits are immutable so generate an id to use to optimize equal()
  this._id = id;
  this._html = html;
  this._showOnScreen = showOnScreen;
  this._element = undefined;
}

Object.defineProperties(Credit.prototype, {
  /**
   * The credit content
   * @memberof Credit.prototype
   * @type {string}
   * @readonly
   */
  html: {
    get: function () {
      return this._html;
    },
  },

  /**
   * @memberof Credit.prototype
   * @type {number}
   * @readonly
   *
   * @private
   */
  id: {
    get: function () {
      return this._id;
    },
  },

  /**
   * Whether the credit should be displayed on screen or in a lightbox
   * @memberof Credit.prototype
   * @type {boolean}
   */
  showOnScreen: {
    get: function () {
      return this._showOnScreen;
    },
    set: function (value) {
      this._showOnScreen = value;
    },
  },

  /**
   * Gets the credit element
   * @memberof Credit.prototype
   * @type {HTMLElement}
   * @readonly
   */
  element: {
    get: function () {
      if (!defined(this._element)) {
        const html = DOMPurify.sanitize(this._html);

        const div = document.createElement("div");
        div.className = "cesium-credit-wrapper";
        div._creditId = this._id;
        div.style.display = "inline";
        div.innerHTML = html;

        const links = div.querySelectorAll("a");
        for (let i = 0; i < links.length; i++) {
          links[i].setAttribute("target", "_blank");
        }

        this._element = div;
      }
      return this._element;
    },
  },
});

/**
 * Returns true if the credits are equal
 *
 * @param {Credit} [left] The first credit
 * @param {Credit} [right] The second credit
 * @returns {boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
 */
Credit.equals = function (left, right) {
  return (
    left === right ||
    (defined(left) &&
      defined(right) &&
      left._id === right._id &&
      left._showOnScreen === right._showOnScreen)
  );
};

/**
 * Returns true if the credits are equal
 *
 * @param {Credit} [credit] The credit to compare to.
 * @returns {boolean} <code>true</code> if left and right are equal, <code>false</code> otherwise.
 */
Credit.prototype.equals = function (credit) {
  return Credit.equals(this, credit);
};

/**
 * @private
 */
Credit.prototype.isIon = function () {
  return this.html.indexOf("ion-credit.png") !== -1;
};

/**
 * @private
 * @param attribution
 * @return {Credit}
 */
Credit.getIonCredit = function (attribution) {
  const showOnScreen =
    defined(attribution.collapsible) && !attribution.collapsible;
  const credit = new Credit(attribution.html, showOnScreen);

  return credit;
};

/**
 * Duplicates a Credit instance.
 *
 * @param {Credit} [credit] The Credit to duplicate.
 * @returns {Credit} A new Credit instance that is a duplicate of the one provided. (Returns undefined if the credit is undefined)
 */
Credit.clone = function (credit) {
  if (defined(credit)) {
    return new Credit(credit.html, credit.showOnScreen);
  }
};
export default Credit;
