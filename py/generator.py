#!\Users\Gebruiker\AppData\Local\Microsoft\WindowsApps\python3.9.exe
#^ systeem afhankelijk
# -*- coding: UTF-8 -*-

#(linux shebang: !/usr/bin/env python3)
import cgi, cgitb
import os
import random
import math
import subprocess

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
    <script src="./js/randomise.js"></script>
    <script src="./js/Databank.js"></script>
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

# if the script don't need output.
subprocess.call(["php","-f", "../maakSQLTabellen.php","width:"+width+"", "height:"+height+"", "tableName:"+filename+""])

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
    l = [] # lijst van alle teksten
    for i, img in enumerate(Templist):
        if img != "":
            value = str(fs.getvalue(img + "?formText"))
            l.append(value)
    imgList = Templist[:math.ceil(height*width/2)] # imgList is list of all images + text
    imgList.extend(l)
    # [cat.jpg, cow.jpg, kat, koe]

else:# unique mode => 2 unique images that form a pair
    imgList = Templist[:height*width]

random.shuffle(imgList)
classList = list.copy(imgList)

if (fs.getvalue("gametype") == "text"):
    for i in range(len(imgList)): # find the id that is with the image
        for j in range(height*width):
            id = str(fs.getvalue("image" + str(j))) # cat.jpg?0
            if (len(imgList[i].split('.')) == 1): # this entry is plain text
                value = imgList[i]
                if (fs.getvalue(id.split('?')[0] + "?formText") == value): # link found between image and its own text
                    classList[i] = id.split('?')[1]
                    continue
            elif (id.split('?')[0] == imgList[i]): # check if image is image from id -> cat.jpg == donkey.jpg or cat.jpg == cat.jpg
                classList[i] = id.split('?')[1]
                
else:
    for i in range(len(imgList)): # find the id that is with the image
        for j in range(height*width):
            id = str(fs.getvalue("image" + str(j)))
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

        if len(imgList[tel].split('.')) == 1:
            file.write(f"""<p class="img">{imgList[tel]}</p>
                            </div>
                        </td>""")
        # if text: make p element with text inside
        #   file.write(f""" <p class="img">{str(imgList[tel])}</p> """)
        # else: do below
        else:
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

