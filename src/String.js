/**
 * @namespace String
 */

/**
 * Calculate edit distance between string a and b
 *
 * @see {@link https://en.wikipedia.org/wiki/Edit_distance|Article on Wikipedia}
 * @param a {string} A
 * @param b {string} B
 * @returns {number} Distance
 */
String.editDistance = function(a, b) {
  var matrix = [], i, j;

  if(a.length === 0) { return b.length; }
  if(b.length === 0) { return a.length; }
  if(a == b) { return 0; }

  // increment along the first column of each row
  for(i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
          Math.min(matrix[i][j-1] + 1, // insertion
            matrix[i-1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
};

/**
 * Get similarity ratio based on edit distance
 *
 * @see {@link String.editDistance}
 * @param a {string} A
 * @param b {string} B
 * @returns {number} Ratio
 */
String.getSimilarity = function(a, b) {
  var l = Math.max(a.length, b.length);
  return (l - String.editDistance(a, b) / 2) / l;
};

/**
 * Returns string with capitalised first letter
 *
 * @param [lower=false] {boolean} Flag if should lower all letters first
 * @returns {string} New string
 */
String.prototype.capitaliseFirstLetter = function(lower) {
  var value = this.valueOf();

  if(lower) {
    value = value.toLowerCase();
  }

  return value.replace(/[a-z]/i, (m) => m.toUpperCase());
};

/**
 * Returns string with lower first letter
 *
 * @returns {string} New string
 */
String.prototype.lowerFirstLetter = function() {
  return this.valueOf().replace(/[a-z]/i, (m) => m.toLowerCase());
};

/**
 * Returns string with removed cases
 *
 * @returns {string} New string
 */
String.prototype.noCase = function() {
  var value = this.valueOf();

  // clean kebab and snake case
  value = value.replace(/[-_]/g, ' ');

  // clean pascal case
  value = value.lowerFirstLetter();

  // clean camel case
  value = value.replace(/[A-Z][a-z]/g, (m) => ' ' + m.toLowerCase());
  value = value.replace(/([a-z])([A-Z])/g, (m, m1, m2) => m1 + ' ' + m2);

  return value;
};

/**
 * Returns string in camelCase
 *
 * @returns {string} String in camelCase
 */
String.prototype.toCamelCase = function() {
  var value = this.valueOf();

  // normalize
  value = value.noCase();

  // replace
  value = value.replace(/ [a-z]/gi, (m) => m[1].toUpperCase());

  return value;
};

/**
 * Returns string in PascalCase
 *
 * @returns {string} String in PascalCase
 */
String.prototype.toPascalCase = function() {
  return this.toCamelCase().capitaliseFirstLetter();
};

/**
 * Returns string in kebab-case
 *
 * @returns {string} String in kebab-case
 */
String.prototype.toKebabCase = function() {
  var value = this.valueOf();

  // normalize
  value = value.noCase();

  // replace
  value = value.trim().toLowerCase().replace(/\s/g, '-');

  return value;
};

/**
 * Returns checksum crc32
 *
 * @author schnaader
 * @returns {number} Checksum
 */
String.prototype.toChecksum = function() {
  var value, i, chk;

  value = this.valueOf();
  chk = 0x12345678;

  for (i = 0; i < value.length; i++) {
    chk += value.charCodeAt(i) * (i + 1);
  }

  return chk;
};

/**
 * Returns string in boolean
 *
 * @returns {boolean} True if string looks somehow like 'true'
 */
String.prototype.toBoolean = function() {
  return this.valueOf().toLowerCase() === 'true';
};

/**
 * Returns reversed string
 *
 * @returns {string} Reversed string
 */
String.prototype.reverse = function() {
  return this.valueOf().split('').reverse().join('');
};

/**
 * Check if string is like given query (you can use regexp notation)
 *
 * @param query {string} Query
 * @returns {boolean} Verdict
 */
String.prototype.isLike = function(query) {
  return new RegExp('^' + query + '$').test(this.valueOf());
};

if(typeof String.prototype.includes != 'function') {
  /**
   * Polyfill for ECMAScript 2015 for String.prototype.includes
   *
   * @param search {string} Search for
   * @param [start=0] {number} Searching start position
   * @returns {boolean} Verdict
   */
  String.prototype.includes = function(search, start) {
    if (typeof start !== 'number') {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}