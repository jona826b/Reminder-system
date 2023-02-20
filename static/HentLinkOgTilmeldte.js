getTilmeldteAndLink() {
    // Set the search parameters
    var subject = "Ny tilmelding til projekt";
    var beforeDate = new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000); // Search for emails received in the last 2 weeks
    var searchQuery = "subject:" + subject + " after:" + Utilities.formatDate(beforeDate, Session.getScriptTimeZone(), "yyyy/MM/dd");
    // Get all emails with the specified subject received within the last 2 weeks
    var threads = GmailApp.search(searchQuery);
    var messages = [];
    // Iterate over all threads and add all messages to the messages array
    for (var i = 0; i < threads.length; i++) {
      var thread = threads[i];
      var threadMessages = thread.getMessages();
      messages = messages.concat(threadMessages);
    }
    // Iterate over all emails and extract the number of Tilmeldte and link
    for (var i = threads.length - 1; i >= 0; i--) {
      var message = messages[i];
      var body = message.getPlainBody();
      // Extract the number of signups
      var tilmeldte = body.match(/Samlet antal tilmeldinger til projektet:\s*(\d+)/)[1];
      // Extract the link
      var link = body.match(/Link til projekt:\s*(\S+)/)[1];
      if (!link.startsWith('http')) {
        link = 'https://' + link;
      }
      // Check if the link already exists in the Google Sheet
      var sheet = SpreadsheetApp.getActiveSheet();
      var data = sheet.getDataRange().getValues();
      var nextID;
      for (var j = 0; j < data.length; j++) {
        if (data[j][2] == link) {
          // If the link exists, update the Tilmeldte value in the corresponding row
          sheet.getRange(j+1, 10).setValue(tilmeldte);
          nextID = data[j][1]; // Set nextID to the existing value in the sheet
          break;
        } else if (j == data.length - 1) {
          // If the link doesn't exist, append the Tilmeldte and link to the sheet
          var lastRow = sheet.getLastRow() + 1;
          var valuesInCol = sheet.getRange("B:B").getValues().flat().filter((x) => !isNaN(x));
          nextID = Math.max.apply(null, valuesInCol) + 1;
          sheet.getRange(lastRow, 10).setValue(tilmeldte);
          sheet.getRange(lastRow, 3).setValue(link);
          sheet.getRange(lastRow, 2).setValue(nextID);
        }
        // Mark the email as read
        message.markRead();
      }
      // Update the nextID value for the existing row, if it wasn't already set
      if (nextID && nextID != '') {
        sheet.getRange(j+1, 2).setValue(nextID);
      }
    }
    
}