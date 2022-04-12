#!/usr/bin/env python3
#^ systeem afhankelijk
# -*- coding: UTF-8 -*-

#(linux shebang: !/usr/bin/env python3)
import cgi, cgitb
import os
import random
import math

print("Content-type: text/html\n\n")

fs = cgi.FieldStorage()
filename = str(fs.getvalue("gameName"))

print("""
<!DOCTYPE html> 
<html lang="nl">
<head>
""")

print('<meta http-equiv="refresh" content="1; ../' + filename +'.html">')

print("""
    <title> Memory </title>
</head>
<body/>
</html>
""")



try:
    os.chmod("../" + filename + ".html", 0o777)
except:
    pass
file = open("../" + filename + ".html","w")

file.write("""
<!DOCTYPE html> 
<html lang="nl">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <link rel="stylesheet" href="./css/opmaak.css">
    <title> test </title>
	<script src="./js/script.js"></script>
    <script src="./js/endAnimation.js"></script>
</head>
    <body>
        <button class="button-1" onclick="restart()">Restart</button>
        <canvas id="canvas" width="300" height="300" hidden="">Canvas is not supported in your browser.</canvas>
        <div id=main>
        <div id="wrapper">
            <table id="table">
""")


dimensions = str(fs.getvalue("dimensions"))
dimvalues = dimensions.split('x')

width = int(dimvalues[0])
height = int(dimvalues[1])

#width = int(fs.getvalue("width"))
#height = int(fs.getvalue("height"))


#width = 5
#height = 5

# if height*width > 18:
#     width = 6   #hard coded aantal afb
#     height = 3

#hard coded afb
Templist = []

for i in range(height*width):
    if fs.getvalue("image" + str(i)):
        Templist.append(fs.getvalue("image" + str(i)).split('?')[0])
    #print(Templist[i])

imgList = 0


if (fs.getvalue("gametype") == "paren"): # normal mode => 2 of the same image
    imgList = Templist[:math.ceil(height*width/2)] + Templist[:math.ceil(height*width/2)] #elk pretje 2x laten voorkomen

elif(fs.getvalue("gametype") == "text"):
    # check dat er exact zoveel images aanwezig zijn
    # text mode => 1 unique image with 1 text
    imgList = Templist[:math.ceil(height*width/2)]

else:# unique mode => 2 unique images that form a pair
    imgList = Templist[:height*width]

random.shuffle(imgList)
classList = list.copy(imgList)

for i in range(len(imgList)): # find the id that is with the image
    for j in range(height*width):
        id = str(fs.getvalue("image" + str(j))) # moet speciaal geval voor uniek zijn
        if (id.split('?')[0] == classList[i]): # check if image is image from id
            classList[i] = id.split('?')[1]

tel = 0
for y in range(height):
    file.write("\t\t<tr>")
    for x in range(width):
        file.write("""
                    <td class="cardPosition">
                        <div id=" """)
        file.write(str(x) + '_' + str(y))
        file.write('" class="' + classList[tel] +  ' card" tabindex="0">')
        # if text: make p element with text inside
        #   file.write(f""" <p class="img">{str(imgList[tel])}</p> """)
        # else: do below
        file.write("""                             <img class="img" src=" """+ "./media/" + imgList[tel] +  """"/>
                        </div>
                    </td>
        """)
        tel += 1
    file.write("\t\t</tr>")

file.write("""
            </table>
            </div>
        </div>
    </body>
</html>""")
file.close()

