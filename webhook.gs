var sheetName = 'SHEET_NAME'
var idSheet = "SPREADSHEET_ID";

//====== END OF SETTINGS==========////

         function getAccess(){
           SpreadsheetApp.openById(idSheet).getSheetByName(sheetName);
         }

		function doPost (e) {
		  var lock = LockService.getScriptLock()
		  lock.tryLock(10000)

		  try {
			var doc = SpreadsheetApp.openById(idSheet)
			var sheet = doc.getSheetByName(sheetName)

			var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
			var nextRow = sheet.getLastRow() + 1

			var newRow = headers.map(function(header) {
			  return header === 'timestamp' ? new Date() : e.parameter[header]
			})

			sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])

			return ContentService
			  .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
			  .setMimeType(ContentService.MimeType.JSON)
		  }

		  catch (e) {
			return ContentService
			  .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
			  .setMimeType(ContentService.MimeType.JSON)
		  }

		  finally {
			lock.releaseLock()
		  }
		}
