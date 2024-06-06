#Match Master
## What is it?
Match Master is a simple web app that allows users to make accounts (or use OAuth) and then create tournaments where other users may join. The creator of tournaments can then make matches and assign attending users to these matches.
The creator also picks the winner for each match.

## What does it use?
Match Master uses an SQL back end, .NET ASP for the API and Angular for all front end. It also uses OAuth as a second means of authenticating.

## How can I run it locally?
To run Match Master locally:
1. Download the whole repo
2. Install [.NET](https://learn.microsoft.com/en-us/dotnet/core/install/) and [Angular](https://v17.angular.io/guide/setup-local)
3. Setup a local [SQL database](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (I used [SSMS](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver16#download-ssms))
4. Run the Query in the CREATE_TABLES.txt file
   - 3b. Optionally run the DummyData.txt query for some basic data in the tables
5. Go into the MatchMasterAPI file and add `appsettings.json` file into the root directory
6. Inside that file include your connection string like this: <br />	
    ```
    "ConnectionStrings":{
	    "MatchMasterConnection": "<<Your connection string here>>"
    }
    ```
    _If you are unsure what a connection string is it typically looks like this: "Server=`server`,Database=`database name`, User Id=`user`,Password=`password`;" you can find more help [online](https://www.connectionstrings.com/sql-server/)_
7. Once your connection string is set run `dotnet run` in the MatchMasterAPI root directory, you should something that says "Now Listening on: http://localhost: `port`". Note down that port number
8. Open the MatchMasterNG files, go to `src > app > services > api-config.service.ts`. In this file you should see a apiUrl variable, just change the port
       <br />`apiUrl = 'http://localhost:<port>/api'`
9. Once the api config is setup, open two terminals, one with MatchMasterNG and one with MatchMasterAPI. In the API file (_if not already running_) run `dotnet run`, then in the NG file run `ng serve -o` this should automatically open your  browser
10. After both are running you should be able to use the web app as you'd like, making your own users, tournaments and matches! :D
