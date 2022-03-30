#!/usr/bin/env python3
#^ systeem afhankelijk
# -*- coding: UTF-8 -*-

#(linux shebang: !/usr/bin/env python3)
import cgi, cgitb
import os
import random
import math

print("Content-type: text/html\n\n")


print("""
<!DOCTYPE html> 
<html lang="nl">
<head>
    <meta http-equiv="refresh" content="1; ../spel.html">
    <title> test </title>
</head>
<body/>
</html>
""")

file = open("../spel.html","w")

file.write("""
<!DOCTYPE html> 
<html lang="nl">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <link rel="stylesheet" href="./css/opmaak.css">
    <title> test </title>
	<script src="./js/script.js"></script>
</head>
    <body onload="init()">
        <table id="table">
""")

fs = cgi.FieldStorage()
width = int(fs.getvalue("width"))
height = int(fs.getvalue("height"))


#width = 5
#height = 5

if height*width > 18:
    width = 6   #hard coded aantal afb
    height = 3

#hard coded afb
Templist =  os.listdir(os.path.abspath("../media"))
#print(imgList)

imgList = 0

if (fs.getvalue("unique") == "same"):
    imgList = Templist[:math.ceil(height*width/2)] + Templist[:math.ceil(height*width/2)] #elk pretje 2x laten voorkomen

else:
    # check dat er exact zoveel images aanwezig zijn
    imgList = Templist[:height*width]

random.shuffle(imgList)
classList = list.copy(imgList)

for i in range(len(imgList)):
    classList[i] = os.path.splitext(classList[i])[0]


tel = 0
for y in range(height):
    file.write("\t\t<tr>")
    for x in range(width):
        file.write("""
                    <td class="cardPosition">
                        <div id=" """)
        file.write(str(x) + '_' + str(y))
        file.write('" class="' + classList[tel] +  ' card" tabindex="0">')
        file.write("""                             <img class="img" src=" """+ "./media/" + imgList[tel] +  """"/>
                        </div>
                    </td>
        """)
        tel += 1
    file.write("\t\t</tr>")

file.write("""
        </table>
    </body>
</html>""")
file.close()
