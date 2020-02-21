import pandas as pd
import requests
from lxml import html
from pandas import ExcelWriter
# import numpy as np

df = pd.DataFrame(columns=['Word','Meaning'])
# print (df)

link = ""
index = 0
for i in range(1,92):
    link = "https://www.memrise.com/course/37909/1000-hindi-words-for-beginners/" + str(i) + "/"
    # print (link)
    page = requests.get(link)
    doc = html.fromstring(page.content)

    for j in range(1,16):
        wrd_xpath = '//*[@id="content"]/div/div/div[2]/div[' + str(j+3) + ']/div[3]/div'
        mean_xpath = '//*[@id="content"]/div/div/div[2]/div[' + str(j+3) + ']/div[4]/div'
        # print (wrd_xpath)
        try:
            word = doc.xpath(wrd_xpath)[0].text
            meaning = doc.xpath(mean_xpath)[0].text
            if (word != None and meaning !=None):
                df.loc[index] = [word, meaning]
                index += 1
        except (ValueError,IndexError):
            break
    
    print (i)
    
writer = ExcelWriter('hindiwords.xlsx')
df.to_excel(writer,'words')
writer.save()

print ("done")