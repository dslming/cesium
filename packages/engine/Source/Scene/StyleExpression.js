import DeveloperError from "../Core/DeveloperError.js";

/**
 * An expression for a style applied to a {@link Cesium3DTileset}.
 * <p>
 * Derived classes of this interface evaluate expressions in the
 * {@link https://github.com/CesiumGS/3d-tiles/tree/main/specification/Styling|3D Tiles Styling language}.
 * </p>
 * <p>
 * This type describes an interface and is not intended to be instantiated directly.
 * </p>
 *
 * @alias StyleExpression
 * @constructor
 *
 * @see Expression
 * @see ConditionsExpression
 */
function StyleExpression() {}

/**
 * Evaluates the result of an expression, optionally using the provided feature's properties. If the result of
 * the expression in the
 * {@link https://github.com/CesiumGS/3d-tiles/tree/main/specification/Styling|3D Tiles Styling language}
 * is of type <code>Boolean</code>, <code>Number</code>, or <code>String</code>, the corresponding JavaScript
 * primitive type will be returned. If the result is a <code>RegExp</code>, a Javascript <code>RegExp</code>
 * object will be returned. If the result is a <code>Cartesian2</code>, <code>Cartesian3</code>, or <code>Cartesian4</code>,
 * a {@link Cartesian2}, {@link Cartesian3}, or {@link Cartesian4} object will be returned. If the <code>result</code> argument is
 * a {@link Color}, the {@link Cartesian4} value is converted to a {@link Color} and then returned.
 *
 * @param {Cesium3DTileFeature} feature The feature whose properties may be used as variables in the expression.
 * @param {object} [result] The object onto which to store the result.
 * @returns {boolean|number|string|RegExp|Cartesian2|Cartesian3|Cartesian4|Color} The result of evaluating the expression.
 */
StyleExpression.prototype.evaluate = function (feature, result) {
  DeveloperError.throwInstantiationError();
};

/**
 * Evaluates the result of a Color expression, optionally using the provided feature's properties.
 * <p>
 * This is equivalent to {@link StyleExpression#evaluate} but always returns a {@link Color} object.
 * </p>
 *
 * @param {Cesium3DTileFeature} feature The feature whose properties may be used as variables in the expression.
 * @param {Color} [result] The object in which to store the result.
 * @returns {Color} The modified result parameter or a new Color instance if one was not provided.
 */
StyleExpression.prototype.evaluateColor = function (feature, result) {
  DeveloperError.throwInstantiationError();
};

/**
 * Gets the shader function for this expression.
 * Returns undefined if the shader function can't be generated from this expression.
 *
 * @param {string} functionSignature Signature of the generated function.
 * @param {object} variableSubstitutionMap Maps variable names to shader variable names.
 * @param {object} shaderState Stores information about the generated shader function, including whether it is translucent.
 * @param {string} returnType The return type of the generated function.
 *
 * @returns {string} The shader function.
 *
 * @private
 */
StyleExpression.prototype.getShaderFunction = function (
  functionSignature,
  variableSubstitutionMap,
  shaderState,
  returnType,
) {
  DeveloperError.throwInstantiationError();
};

/**
 * Gets the variables used by the expression.
 *
 * @returns {string[]} The variables used by the expression.
 *
 * @private
 */
StyleExpression.prototype.getVariables = function () {
  DeveloperError.throwInstantiationError();
};

export default StyleExpression;
