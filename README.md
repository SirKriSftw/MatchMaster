#Match Master
## What is it?
Match Master is a simple web app that allows users to make accounts (or use OAuth) and then create tournaments where other users may join. The creator of tournaments can then make matches and assign attending users to these matches.
The creator also picks the winner for each match.

## What does it use?
Match Master uses an SQL back end, .NET ASP for the API and Angular for all front end. It also uses OAuth as a second means of authenticating.

## How can I run it locally?
To run Match Master locally:
	* 1. Download the whole repo
	* 2. Setup a local SQL database (I used SSMS)
	* 3. Run the Query in the CREATE_TABLES.txt file
		* 3b. Optionally run the DummyData.txt query for some basic data in the tables
	* 4. Go into the MatchMasterAPI file and add 'appsettings.json' file into the root directory
	* 5. Inside that file include your connection string like this:	
		"ConnectionStrings":{
    			"MatchMasterConnection": "<<Your connection string here>>"
  		}
		_If you are unsure what a connection string is it typically looks like this: "Server=<server>,Database=<database name>, User Id=<user>,Password=<password>;" you can find more help online_
	* 6. Once your connection string is set run 'dotnet run' in the MatchMasterAPI root directory, you should something that says "Now Listening on: "http://localhost:<port>". Note down that port number
	* 7. Open the MatchMasterNG files, go to src > app > services > api-config.service.ts. In this file you should see a apiUrl variable, just change the port _apiUrl = 'http://localhost:<port>/api'_
	* 8. Once the api config is setup, open two terminals, one with MatchMasterNG and one with MatchMasterAPI. In the API file run 'dotnet run', then in the NG file run 'ng serve -o' this should automatically open your  browser
	* 9. After both are running you should be able to use the web app as you'd like, making your own users, tournaments and matches! :D