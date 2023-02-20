function extractData() {
    // Set the search parameters
    var subject = "Ny kampagnebestilling til";
    var afterDate = new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000); // Search for emails received in the last 2 weeks
    var searchQuery = "subject:" + subject + " after:" + Utilities.formatDate(afterDate, Session.getScriptTimeZone(), "yyyy/MM/dd");
    // Get all emails with the specified subject received within the last 2 weeks
    var threads = GmailApp.search(searchQuery);
    // Iterate over all emails and extract the data
    var sheet = SpreadsheetApp.getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var valuesInCol = sheet.getRange("C:C").getValues().flat().filter((x) => x !== "");
    var valuesInIDCol = sheet.getRange("B:B").getValues().flat().filter((x) => !isNaN(x));
    for (var i = 0; i < threads.length; i++) {
      var messages = threads[i].getMessages();
      for (var j = 0; j < messages.length; j++) {
        var email = messages[j];
        var body = email.getPlainBody();
        var name = body.match(/Kampagne oprettet af:\s*(.*)\r?\n/)[1];
        var campaignsize = parseInt(body.match(/Ny bestilling:\s*(\d+)/)[1]);
        var link = body.match(/https?:\/\/[^\s]+/g)[0];
        // Check if the link already exists in the Google Sheet
        if (valuesInCol.includes(link)) {
          for (var k = 0; k < data.length; k++) {
            if (data[k][2] == link) {
              // Update the campaignsize number for the existing link
              sheet.getRange(k + 1, 9).setValue(campaignsize);
              sheet.getRange(k + 1, 1).setValue(name);
              // Check if the nextID field is empty and append the nextID if it is
              var nextIDRange = sheet.getRange(k + 1, 2);
              if (!nextIDRange.getValue()) {
                var nextID = Math.max.apply(null, valuesInIDCol) + 1;
                while (valuesInIDCol.includes(nextID)) {
                  nextID++;
                }
                nextIDRange.setValue(nextID);
              }
              break;
            }
          }
        } else {
          // Append the data to a Google Sheet if the link doesn't exist
          var lastRow = sheet.getLastRow() + 1;
          sheet.getRange(lastRow, 3).setValue(link);
          sheet.getRange(lastRow, 9).setValue(campaignsize);
          sheet.getRange(lastRow, 1).setValue(name);
          // Append the nextID to the new row
          var nextID = Math.max.apply(null, valuesInIDCol) + 1;
          while (valuesInIDCol.includes(nextID)) {
            nextID++;
          }
          sheet.getRange(lastRow, 2).setValue(nextID);
        }
        // Mark the email as read
        email.markRead();
      }
    }
  }