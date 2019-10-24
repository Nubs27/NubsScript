# NubsScript
Game Strategy for Nanogames.io

Donations accepted in many coin/token types. Donation Addresses:
https://sites.google.com/view/nanogamescrashscripts/home/donation-addresses

Things I would still like to add:

Recovery option to engage when Coins Lost stacks up x% of bankroll

Script to rank streaks seen 1-5 for difficulty & adjust betting accordingly by past streaks

Script to analize losses & calculate by how much it is off (went for Payout of 2.41x & busted at 2.32x) & adjusting Payout accordingly

After a series of 4 10x go to min bet during following red train

At beginning of script pull the last 1k or last 10k rounds to analyze them. At this time I know the variables I need - I do not know how to retrieve the data & format it into data I can use. The website to pull past rounds from is:
	https://nanogamesio.github.io/crash/
	The round's hash can be retrieved by GAME_ENDING function LastGame.hash