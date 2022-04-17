#!/usr/bin/env python3
#^ systeem afhankelijk
# -*- coding: UTF-8 -*-
#(linux shebang: !/usr/bin/env python3)

# This file handles making the html page of the game itself.
# Used HTML Names:
# gameName : name of the game, will be name of file that is generated
# dimensions : the dimensions of the game (2x2, 3x2, ...)
# imageX : contains 1 image with id next to it for connecting multiple images (image.jpg?0)
# gametype : the type of game that is being made (text, uniek, paren)
# imageX?formText : the text that is linked to a certain image

import cgi, cgitb
import os
import random
import math

# give browser temporary html page to show user
print("Content-type: text/html\n\n")

fs = cgi.FieldStorage()
filename = str(fs.getvalue("gameName"))

print("""
<!DOCTYPE html> 
<html lang="nl">
<head>
""")

# refresh to game after python file is done
print('<meta http-equiv="refresh" content="1; ../' + filename +'.html">')

print("""
    <title> Memory </title>
</head>
<body/>
</html>
""")

# make html file and give that file permissions to be executed
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
    <link rel="stylesheet" href="./css/spelOpmaak.css">
""")

print('<title>' + filename  + '</title>')
file.write("""
    <script src="./js/randomise.js"></script>
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

Templist = []

for i in range(height*width):
    temp = fs.getvalue("image" + str(i))
    if temp:
        Templist.append(temp.split('?')[0])

imgList = []

if (fs.getvalue("gametype") == "paren"): # normal mode => 2 of the same image
    imgList = Templist[:math.ceil(height*width/2)] + Templist[:math.ceil(height*width/2)]

elif(fs.getvalue("gametype") == "text"):
    # text mode => 1 unique image with 1 text element
    l = [] # list of all text
    for img in Templist:
        if img != "":
            value = str(fs.getvalue(img + "?formText"))
            l.append(value)
    imgList = Templist[:math.ceil(height*width/2)] # imgList is list of all images
    imgList.extend(l) # extend imageList with all words

else:# unique mode => 2 unique images that form a pair
    imgList = Templist[:height*width]

random.shuffle(imgList)
classList = list.copy(imgList)

if (fs.getvalue("gametype") == "text"):
    for i in range(len(imgList)): # find the id that is with the image
        for j in range(height*width):
            id = str(fs.getvalue("image" + str(j))) # get image + id of image
            if (len(imgList[i].split('.')) == 1): # this entry is plain text
                value = imgList[i]
                if (fs.getvalue(id.split('?')[0] + "?formText") == value): # link found between image and its own text
                    classList[i] = id.split('?')[1]
                    continue
            elif (id.split('?')[0] == imgList[i]): # check if image is image from id
                classList[i] = id.split('?')[1]
                
else:
    for i in range(len(imgList)): # find the id that is with the image
        for j in range(height*width):
            id = str(fs.getvalue("image" + str(j)))
            if (id.split('?')[0] == classList[i]): # check if image is image from id
                classList[i] = id.split('?')[1]

# write all in table file, height rows and width columns
tel = 0
for y in range(height):
    file.write("\t\t<tr>")
    for x in range(width):
        file.write("""
                    <td class="cardPosition">
                        <div id=" """)
        file.write(str(x) + '_' + str(y))
        file.write('" class="' + classList[tel] +  ' card" tabindex="0">')  
        # each card has a class, this is being checked to know if the right ones are selected      

        if len(imgList[tel].split('.')) == 1: # text has been found, make a p tag with class image so that the text can be displayed as an svg
            file.write(f"""<p class="img">{imgList[tel]}</p>
                            </div>
                        </td>""")
        else: # no text has been found so this must be an image, make an image tag with the correct source
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