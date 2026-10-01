# WHAT IS SNIP CHECK?
Snip check is a small web app that helps people check if a hairdresser is the right fit for them before booking an appointment. Users can browse a directory of stylists by using a search that can filter by name, salon, or city. Here you can view a stylist's profile and exsisting reviews, you can even leave your own review!

## HOW TO RUN THIS?
Because this app uses fetch() to load stylists.json, it needs a local server rather than opened directly as a file (browsers can sometimes block fetch on the file://protocol for security reasons)
 
 STEP 1. download this repository
 STEP 2. Open the project folder in a terminal (in vs code ctrl+`)
 STEP 3. Run the following command: 
 pwd to print out exact folder path terminal you are sitting in
 Check that pwd printed an ending with snip-check
 Type python -m http.server (if you get an error message try python3 -m http.server)
 Into your browser's address bar type:
 http://localhost:8000 


## DATA SOURCE
All stylist and review data is mock data stored locally in stylists.json.

It was written by hand for this project and does not represent real people,salons, or reviews.

New reviews submitted through the review form are stored in the browser's localStorage and are not sent anywhere or saved permanently across devices.

## ASSETS
Scissors icon by Freepik, from Flaticon
(https://www.flaticon.com/free-icon/scissors_713883), used under Flaticon's
free license with attribution.

## AI ASSISTANCE DISCLOSURE STATEMENT

I used Claude as an assistant throughout this project:

Claude helped me refine wording and catch grammar/punctuation issues in my project proposal. The idea, structure, and content were entirely my own.

I discussed layout approaches with Claude (how CSS Grid vs. Flexbox could be applied to different parts of the page) before deciding how to structure my CSS.

Claude walked me through each concept in script.js (async/await, fetch, array methods like .filter() and .find(), event listeners, localStorage) one section at a time, explaining what each piece did and why.

I typed, tested, and debugged every line of code myself, including catching and fixing my own syntax errors along the way.

I can explain how every part of this app works, including the async fetch logic, the Grid/Flexbox layout, and the localStorage review system. Color palette, icon choice, project name, and scope decisions were mine.