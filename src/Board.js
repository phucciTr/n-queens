// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      console.log('HI');
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) { //rowIndex is in an integar
      // rowArray is going to be matrix[index];
      //this.attributes is an object.  the keys are the row arrays
      //a row index is going to be this.attributes[rowIndex]
      var currentRow = this.attributes[rowIndex];
      // create a counter for (non-zero element)
      var pieceCount = 0;

      //iterate over rowArray
      for (var i = 0; i < currentRow.length; i++) {
        let currentValue = currentRow[i];

        //if counter is above 1
        //return true
        if (pieceCount > 1) { return true; }

        //if rowarray at i is 1, incriment counter by 1
        if (currentValue !== 0) { pieceCount++; }

      }

      // if we get out of the loop, return false
      return false; // fixme
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {

      let board = this.attributes;
      let matrixKeys = Object.keys(board);

      for (var i = 0; i < matrixKeys.length - 1; i++) {

        if (this.hasRowConflictAt(i)) { return true; }

      }
      return false; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {

      // iterate through attribute keys, only look at attribute keys (which is an array) at the index that is colIndex
      let matrixKeys = Object.keys(this.attributes);
      let columnArray = [];
      for (var i = 0; i < matrixKeys.length - 1; i++) {
        columnArray.push(this.attributes[i][colIndex]);
      }

      // console.log(columnArray);
      let pieceCount = 0;
      for (var i = 0; i < columnArray.length; i++) {
        if (columnArray[i] !== 0 ) { pieceCount++; }
        if (pieceCount > 1) { return true; }
      }

      return false; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {

      let columnIndexArray = this.attributes[0];

      //iterate through this.attributes[0] which will be the column indixies
      for (var i = 0; i < columnIndexArray.length; i++) { //each i in this for loop is a colIndex

        //if column at colIndex has conflict
        if (this.hasColConflictAt(i)) { return true; }
      }
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      /**



       * -> [0, 0, 0, 0]
    1 [0, 1, 0, 0],
    2 [0, 0, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]



          * -> [1, 1, 0]
    1 [0, 1, 0, 0],
    2 [0, 0, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]



             * -> [0, 0]
    1 [0, 1, 0, 0],
    2 [0, 0, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]

             */

      //declare an empry array
      var diagArray = [];


      //we should identify how many spots we need to check for existance
        // take the length of row 1 and subtract majorDiagonalColumnIndexAtFirstRow
      var stepCount = this.attributes[0].length - majorDiagonalColumnIndexAtFirstRow;

      var currentColumn = majorDiagonalColumnIndexAtFirstRow;
      var currentRow = 0;

      //do a while loop here, while stepCount is greater than 0;
      while (stepCount > 0) {
        diagArray.push(this.attributes[currentRow][currentColumn]);

        //incriment currentColumn
        currentColumn++;

        //incriment currentRow
        currentRow++;

        //decrement stepCount
        stepCount--;
      }
      console.log(diagArray);

      // check array to see if there is more than one 1
      let pieceCount = 0;

      for (var i = 0; i < diagArray.length; i++) {
        if (diagArray[i] !== 0) { pieceCount++; }
        if (pieceCount > 1) { return true; }
      }

      return false; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      /**



       * -> [0, 0, 0, 0]
    1 [0, 1, 0, 0],
    2 [0, 0, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]



          * -> [1, 1, 0]
    1 [0, 1, 0, 0],
    2 [0, 0, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]



             * -> [0, 0]
    1 [0, 1, 0, 0],
    2 [0, 0, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]

             */

      var firstRow = this.attributes[0];

      // iterate through the 1st row
      for (let i = 0; i < firstRow.length; i++) {

        // invoke hasMajorDiagonalConflictAt the currentIndex
        // if hasMajorDiagonalConflictAt returns true, return true
        if (this.hasMajorDiagonalConflictAt(i)) { return true; }
      }

      // once outside the loop, return false
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
