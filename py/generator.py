#!\Users\Gebruiker\AppData\Local\Microsoft\WindowsApps\PythonSoftwareFoundation.Python.3.9_qbz5n2kfra8p0
#^ systeem afhankelijk
# -*- coding: UTF-8 -*-

import cgi
import os

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


# width = 5
# height = 5

#hard coded afb
imgList = os.listdir("../media/")
classList = list.copy(imgList)

for i in range(len(imgList)):
    classList[i] = os.path.splitext(classList[i])[0]

if height*width > 18:
    width = 6   #hard coded aantal afb
    height = 3



aant = 0
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
        aant += 1
        if aant >= 2:
            tel += 1
            aant = 0
    file.write("\t\t</tr>")

file.write("""
        </table>
    </body>
</html>""")
file.close()
