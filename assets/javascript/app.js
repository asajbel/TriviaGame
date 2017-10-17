// ID of the Google Spreadsheet
 var spreadsheetID = "1RznpZAVO9Kb2dYlsFCWE4gPrUJkfkKMvMqytoqHAM_s";

 // Make sure it is public or set to Anyone with link can view 
 var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/od6/public/values?alt=json";

 $.getJSON(url, function(data) {

  var entry = data.feed.entry;

  console.log(entry);

  $(entry).each(function() {
  	console.log(this.gsx$question.$t);
  });

 });