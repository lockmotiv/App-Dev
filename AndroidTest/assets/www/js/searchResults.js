$('#sResults').live("pageinit", onPageReady);

var scroll = new iScroll('wrapper', { vScrollbar: false, hScrollbar:false, hScroll: false });


function onPageReady() {
    db = window.openDatabase("LokallokalDirectoryDB", "1.0", "Lockmotiv Lokallokal", 200000);
    if (typeof dbCreated == 'undefined' || !dbCreated)   {
    	console.log(1)    	
    	db.transaction(populateDB, transaction_error, populateDB_success);
    }
    else {  
    	console.log(2)    	  
    	db.transaction(getEntries, transaction_error);
    }
}

function transaction_error(tx, error) {
	$('#busy').hide();
    alert("Database Error: " + error);
}

function populateDB_success() {
	dbCreated = true;
    db.transaction(getEntries, transaction_error);
}

function getEntries(tx) {
	var sql = "select id, firma, strasse, plz, ort, kunden_nr, img_path from addresses where firma !='' order by firma";
	tx.executeSql(sql, [], getEntries_success);
}

function getEntries_success(tx, results) {
	$('#busy').hide();
    var len = results.rows.length;
    	
    for (var i=0; i < len; i++) {
    	var entry = results.rows.item(i);
    	var cust = entry.kunden_nr > 0;
		$('#entryList').append('<li><a href="?id=' + entry.id + '">' +
			( cust ? '<img src="' + entry.img_path + '" class="list-icon" />' : '' ) + 
			'<p class="line1">' + entry.firma + '</p>' +
			'<p class="line2">' + entry.ort + '</p>' +
			'</a></li>');
    }
	setTimeout(function(){
		scroll.refresh();
	},100);
	db = null;
	$('#entryList').listview('refresh');
}

function populateDB(tx) {
	$('#busy').show();
	tx.executeSql('DROP TABLE IF EXISTS addresses');
	var sql = 
		"CREATE TABLE IF NOT EXISTS `addresses` (" +
		  "`id` integer PRIMARY KEY AUTOINCREMENT," +
		  "`firma` varchar(150) ," +
		  "`alt_name` varchar(150)," +
		  "`memo` mediumtext," +
		  "`vorname` varchar(150) ," +
		  "`nachname` varchar(150) ," +
		  "`strasse` varchar(150) ," +
		  "`plz` varchar(150) ," +
		  "`ort` varchar(150) ," +
		  "`telefon` varchar(150) ," +
		  "`fax` varchar(150) ," +
		  "`mobil` varchar(150) ," +
		  "`email` varchar(150) ," +
		  "`homepage` varchar(150) ," +
		  "`homepage_name` varchar(150) NOT NULL DEFAULT ''," +
		  "`sec_homepage` varchar(150) NOT NULL DEFAULT ''," +
		  "`sec_homepage_name` varchar(150) NOT NULL DEFAULT ''," +
		  "`img_path` varchar(255) ," +
		  "`kunden_nr` int(11) ," +
		  "`features` mediumtext," +
		  "`koord` int(11) ," +
		  "`fragebogen_a` int(11) NOT NULL DEFAULT '0'," +
		  "`fragebogen_f` int(11) NOT NULL DEFAULT '0'" +
		")";
    tx.executeSql(sql);
	

	
	
	for( i = 0; i < addressesSQLArray.length; i++)
		tx.executeSql("insert into addresses values (" + addressesSQLArray[i] + ")");



}
