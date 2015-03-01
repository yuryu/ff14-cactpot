/* 
Perfect Cactpot algorithm and documentation by /u/Aureolux
Ported, condensed, prettified, memoized, and generalized by /u/Super_Aardvark

Solve for the best row choice when 4 tiles have been flipped.
Returns the expected value of picking that row.

state is an array of the current board state, e.g., 001056020
0 means the tile is not flipped. 5 means the tile is showing a 5.

rewards is an array of rewards for each sum.
For example, rewards[6] = 10000;

row is an array of which rows are the best choice to maximize expected value.
It is passed into the function as an array of FALSE.
The function changes the best choices to TRUE. Indices are as follows:
0 = top row
1 = middle row
2 = bottom row
3 = left column
4 = center column
5 = right column
6 = major diagonal
7 = minor diagonal
For example, if the function changes row[5] to TRUE, that means the right column
 is (potentially tied for) the best choice for maximizing expected value. */

var PerfectCactpot = {

   openings: {"100000000":[1677.7854166666664,[false,false,true,false,false,false,true,false,false]],"200000000":[1665.8127976190476,[false,false,true,false,false,false,true,false,false]],"300000000":[1662.504761904762,[false,false,true,false,false,false,true,false,false]],"400000000":[1365.0047619047618,[false,false,false,false,true,false,false,false,false]],"500000000":[1359.5589285714286,[false,false,false,false,true,false,false,false,false]],"600000000":[1364.3044642857142,[false,false,false,false,true,false,false,false,false]],"700000000":[1454.5455357142855,[false,false,false,false,true,false,false,false,false]],"800000000":[1527.0875,[false,false,true,false,true,false,true,false,false]],"900000000":[1517.7214285714285,[false,false,true,false,true,false,true,false,false]],
              "010000000":[1411.3541666666665,[false,false,false,false,true,false,false,false,false]],"020000000":[1414.9401785714288,[false,false,false,false,true,false,false,false,false]],"030000000":[1406.4190476190477,[false,false,false,false,true,false,false,false,false]],"040000000":[1443.3062499999999,[false,false,false,false,false,false,true,false,true]],"050000000":[1444.3172619047618,[false,false,false,false,true,false,true,false,true]],"060000000":[1441.3663690476192,[false,false,false,false,true,false,false,false,false]],"070000000":[1485.6839285714286,[false,false,false,false,true,false,false,false,false]],"080000000":[1512.927976190476,[true,false,true,false,false,false,false,false,false]],"090000000":[1518.466369047619,[true,false,true,false,false,false,false,false,false]],
              "001000000":[1677.7854166666664,[true,false,false,false,false,false,false,false,true]],"002000000":[1665.8127976190476,[true,false,false,false,false,false,false,false,true]],"003000000":[1662.504761904762,[true,false,false,false,false,false,false,false,true]],"004000000":[1365.0047619047618,[false,false,false,false,true,false,false,false,false]],"005000000":[1359.5589285714286,[false,false,false,false,true,false,false,false,false]],"006000000":[1364.3044642857142,[false,false,false,false,true,false,false,false,false]],"007000000":[1454.5455357142855,[false,false,false,false,true,false,false,false,false]],"008000000":[1527.0875,[true,false,false,false,true,false,false,false,true]],"009000000":[1517.7214285714285,[true,false,false,false,true,false,false,false,true]],
              "000100000":[1411.3541666666665,[false,false,false,false,true,false,false,false,false]],"000200000":[1414.9401785714288,[false,false,false,false,true,false,false,false,false]],"000300000":[1406.4190476190477,[false,false,false,false,true,false,false,false,false]],"000400000":[1443.3062499999999,[false,false,true,false,false,false,false,false,true]],"000500000":[1444.3172619047618,[false,false,true,false,true,false,false,false,true]],"000600000":[1441.3663690476192,[false,false,false,false,true,false,false,false,false]],"000700000":[1485.6839285714286,[false,false,false,false,true,false,false,false,false]],"000800000":[1512.927976190476,[true,false,false,false,false,false,true,false,false]],"000900000":[1518.466369047619,[true,false,false,false,false,false,true,false,false]],
              "000010000":[1860.4401785714285,[true,false,true,false,false,false,true,false,true]],"000020000":[1832.5413690476191,[true,false,true,false,false,false,true,false,true]],"000030000":[1834.179761904762,[true,false,true,false,false,false,true,false,true]],"000040000":[1171.9669642857143,[true,false,true,false,false,false,true,false,true]],"000050000":[1176.2047619047619,[true,false,true,false,false,false,true,false,true]],"000060000":[1234.6142857142856,[true,false,true,false,false,false,true,false,true]],"000070000":[1427.3583333333331,[true,false,true,false,false,false,true,false,true]],"000080000":[1544.7607142857144,[true,false,true,false,false,false,true,false,true]],"000090000":[1509.197619047619,[true,false,true,false,false,false,true,false,true]],
              "000001000":[1411.3541666666665,[false,false,false,false,true,false,false,false,false]],"000002000":[1414.9401785714288,[false,false,false,false,true,false,false,false,false]],"000003000":[1406.4190476190477,[false,false,false,false,true,false,false,false,false]],"000004000":[1443.3062499999999,[true,false,false,false,false,false,true,false,false]],"000005000":[1444.3172619047618,[true,false,false,false,true,false,true,false,false]],"000006000":[1441.3663690476192,[false,false,false,false,true,false,false,false,false]],"000007000":[1485.6839285714286,[false,false,false,false,true,false,false,false,false]],"000008000":[1512.927976190476,[false,false,true,false,false,false,false,false,true]],"000009000":[1518.466369047619,[false,false,true,false,false,false,false,false,true]],
              "000000100":[1677.7854166666664,[true,false,false,false,false,false,false,false,true]],"000000200":[1665.8127976190476,[true,false,false,false,false,false,false,false,true]],"000000300":[1662.504761904762,[true,false,false,false,false,false,false,false,true]],"000000400":[1365.0047619047618,[false,false,false,false,true,false,false,false,false]],"000000500":[1359.5589285714286,[false,false,false,false,true,false,false,false,false]],"000000600":[1364.3044642857142,[false,false,false,false,true,false,false,false,false]],"000000700":[1454.5455357142855,[false,false,false,false,true,false,false,false,false]],"000000800":[1527.0875,[true,false,false,false,true,false,false,false,true]],"000000900":[1517.7214285714285,[true,false,false,false,true,false,false,false,true]],
              "000000010":[1411.3541666666665,[false,false,false,false,true,false,false,false,false]],"000000020":[1414.9401785714288,[false,false,false,false,true,false,false,false,false]],"000000030":[1406.4190476190477,[false,false,false,false,true,false,false,false,false]],"000000040":[1443.3062499999999,[true,false,true,false,false,false,false,false,false]],"000000050":[1444.3172619047618,[true,false,true,false,true,false,false,false,false]],"000000060":[1441.3663690476192,[false,false,false,false,true,false,false,false,false]],"000000070":[1485.6839285714286,[false,false,false,false,true,false,false,false,false]],"000000080":[1512.927976190476,[false,false,false,false,false,false,true,false,true]],"000000090":[1518.466369047619,[false,false,false,false,false,false,true,false,true]],
              "000000001":[1677.7854166666664,[false,false,true,false,false,false,true,false,false]],"000000002":[1665.8127976190476,[false,false,true,false,false,false,true,false,false]],"000000003":[1662.504761904762,[false,false,true,false,false,false,true,false,false]],"000000004":[1365.0047619047618,[false,false,false,false,true,false,false,false,false]],"000000005":[1359.5589285714286,[false,false,false,false,true,false,false,false,false]],"000000006":[1364.3044642857142,[false,false,false,false,true,false,false,false,false]],"000000007":[1454.5455357142855,[false,false,false,false,true,false,false,false,false]],"000000008":[1527.0875,[false,false,true,false,true,false,true,false,false]],"000000009":[1517.7214285714285,[false,false,true,false,true,false,true,false,false]]
   },
   defaultPayouts: [0, 0, 0, 0, 0, 0, 10000, 36, 720, 360, 80, 252, 108, 72, 54, 180, 72, 180, 119, 36, 306, 1080, 144, 1800, 3600],
   candidates: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
   ],

   solve: function(input, payout)
   {
       var state = [];
       if (typeof(input) == 'string') {
         for (var i = 0; i < input.length; i++) {
            state[i] = parseInt(input.charAt(i));
         }
       } else if (typeof(input) == 'object') {
         state = input;
       } else {
         return null;
       }

       // Count how many are visible
       var tmp = this.inspect_state(state);
       var ids = tmp[0];
       var unknowns = tmp[1];
       var num_revealed = 9 - tmp[2];

       // If four are visible, we are picking between eight rows. Otherwise, we are picking
       // between nine tiles (although we'll never be picking revealed tiles)
       var num_options = 9;
       if (num_revealed == 4)
           num_options = 8;

       // Run the appropriate function to solve for the optimnal choice
       var which_to_flip = [];
       for (var i = 0; i < num_options; i++)
           which_to_flip[i] = false;
       var value = 0;
       var tot_win = new Array(this.candidates.length);

       if (num_revealed == 0) {
           // You don't get to choose the first spot, but here's the answer anyway
           return [0, [true, false, true, false, false, false, true, false, true]];
       } else if (num_revealed == 1) {
           var editedPayouts = false;
           for (var i = 6; i < payout.length; i++) {
               if (payout[i] != this.defaultPayouts[i]) {
                  editedPayouts = true;
                  break;
               }
           }
           if (editedPayouts) {
               // This will take a long time, but we have no choice
               value = this.solve_any(state, payout, which_to_flip);
           } else {
               // Using our pre-calculated library, this is much faster
               value = this.solve_1 (state, payout, which_to_flip);
           }
       } else if ( num_revealed == 4 ) {
           value = this.calc_expectation(state, payout, ids, unknowns, which_to_flip, tot_win);
       } else {
           value = this.solve_any(state, payout, which_to_flip);
       }
       if ( num_revealed != 4 ) {
         var dummy_array = [];
         this.calc_expectation(state, payout, ids, unknowns, dummy_array, tot_win);
       }
       var result = [value, which_to_flip, tot_win];
       if (window.console) console.log("Expected value: " + value + " MGP");
       return result;
   },

   // returns [ids, unknowns, num_hidden]
   inspect_state: function(state) {
       var ids = [];
       var unknowns = [];
       var num_hidden = 0;
       var has = [];

       for ( var i = 0; i < 9; i++ ) {
           if ( ! state[i] ) {
               // Storing the ids of all locations which are currently unrevealed
               ids.push(i);
               num_hidden++;
           } else {
               // Checking which numbers are currently visible
               has[state[i]] = 1;
           }
       }

       // From the previous step, we know which numbers are not yet visible:
       //  these are the possible unknowns
       for ( var i = 1; i <= 9; i++ ) {
           if ( ! has[i] )
           {
               unknowns.push(i);
           }
       }
       return [ids, unknowns, num_hidden];
   },

   solve_any: function(state, rewards, options)
   {
       var dummy_array = [];

       var tmp = this.inspect_state(state);
       var ids = tmp[0];
       var unknowns = tmp[1];
       var num_hidden = tmp[2];

       if ( ( 9 - num_hidden ) >= maxRevealedNums ) {
          // We've revealed as many numbers as we can -- time for the final assessment
          return this.calc_expectation(state, rewards, ids, unknowns, options, dummy_array);
       } else {
          // Determine which tile to reveal next.
          // Loop over every unknown tile and every possible value that could appear.
          // Solve the resulting cases with a recursive call to solve_any.
          var tot_win = new Array(num_hidden);
          for ( var i = 0; i < num_hidden; i++ ) tot_win[i] = 0;
          for ( var i = 0; i < num_hidden; i++ ) {
              for (var j = 0; j < num_hidden; j++)
              {
                  state[ids[i]] = unknowns[j];
                  tot_win[i] += this.solve_any(state, rewards, dummy_array);
                  state[ids[i]] = 0;
              }
          }
          var curmax = tot_win[0];
          options[ids[0]] = true;
          for (var i = 1; i < tot_win.length; i++)
          {
              if (tot_win[i] > curmax + EPS)
              {
                  curmax = tot_win[i];
                  for (var j = 0; j < i; j++)
                      options[ids[j]] = false;
                  options[ids[i]] = true;
              }
              else if(tot_win[i] > curmax - EPS)
              {
                  options[ids[i]] = true;
              }
          }
          // Each tile can be flipped to reveal one of num_hidden values (one number per space).
          // Divide by num_hidden to get the true expected value.
          return curmax / num_hidden;
       }
   },

   // Special case, because it would take so long
   solve_1: function(state, rewards, flip)
   {
      var stateStr = state.join('');
      var newflip = this.openings[stateStr][1];
      for (var i = 0; i < flip.length; i++) {
         flip[i] = newflip[i];
      }
      return this.openings[stateStr][0];
   },

   // calculate expectation
   calc_expectation: function(state, rewards, ids, unknowns, options, tot_win) {
     for ( var i = 0; i < this.candidates.length; i++ ) tot_win[i] = 0;

     var permutations = 0;

     // Loop over all possible permutations on the unknowns
     do {
         permutations++;
         for (var i = 0; i < ids.length; i++) {
             state[ids[i]] = unknowns[i];
         }
         // For each row, cumulatively sum the winnings for picking that row
         tot_win[0] += rewards[state[0] + state[1] + state[2]];
         tot_win[1] += rewards[state[3] + state[4] + state[5]];
         tot_win[2] += rewards[state[6] + state[7] + state[8]];
         tot_win[3] += rewards[state[0] + state[3] + state[6]];
         tot_win[4] += rewards[state[1] + state[4] + state[7]];
         tot_win[5] += rewards[state[2] + state[5] + state[8]];
         tot_win[6] += rewards[state[0] + state[4] + state[8]];
         tot_win[7] += rewards[state[2] + state[4] + state[6]];
     } while (this.next_permutation(unknowns));
     // Restore state for next use
     for (var i = 0; i < ids.length; i++ )
       state[ids[i]] = 0;

     for ( var i = 0; i < tot_win.length; i++ )
       tot_win[i] /= permutations;

     // Find the maximum. Start by assuming option 0 is best.
     var curmax = tot_win[0];
     options[0] = true;
     for (var i = 1; i < 8; i++)
     {
         // If another row yielded a higher expected value:
         if (tot_win[i] > curmax)
         {
             // Mark all the previous rows as FALSE (not optimal) and the current one as TRUE
             curmax = tot_win[i];
             for (var j = 0; j < i; j++)
                 options[j] = false;
             options[i] = true;
         }
         else if(tot_win[i] == curmax)
         {
             // For a tie, mark the current one as TRUE, and leave the previous ones intact
             options[i] = true;
         }
     }
     // The current totals are for a number of possible configurations.
     // Divide by that number to get the actual expected value.
     if ( isNaN(curmax) ) throw "Something is wrong.";
     return curmax;
   },

   next_permutation: function(array)
   {
      var i = array.length - 1;
      while ( i > 0 ) {
        var k = i;
        i--;
        if ( array[i] < array[k] ) {
          var j = array.length - 1;
          while ( array[i] >= array[j] ) j--;
          var tmp = array[j];
          array[j] = array[i];
          array[i] = tmp;
          this.reverse(array, k, array.length);
          return true;
        }
      }
      return false;
   },

   reverse: function(array, begin, end) {
      var revSlice = array.slice(begin, end).reverse();

      for (var i = 0; i < revSlice.length; i++) {
         array[begin + i] = revSlice[i];
      }
   },

};

var EPS = 0.00001;