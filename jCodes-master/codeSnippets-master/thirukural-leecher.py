import pandas as pd
import requests
from lxml import html
from pandas import ExcelWriter
# import numpy as np

df = pd.DataFrame(columns=['Kural_No','Kural_Adhigaram','Kural','Mu_VA_exp','Sa_Pa_exp'])
# print (df)

link = ""
index = 0
for i in range(1,1331):
    link = "http://www.dinamalar.com/kural_detail.asp?kural_No=" + str(i)
    # print (link)
    page = requests.get(link)
    doc = html.fromstring(page.content)
    kural_number = doc.xpath('//*[@id="selText"]/div')[0].text
    kural_adhigaram = doc.xpath('//*[@id="page"]/div[6]/div[3]/div[1]/div[1]/div[1]')[0].text

    kural = doc.xpath('//*[@id="selText"]/p')[0].text_content()
    mu_va_exp = doc.xpath('//*[@id="page"]/div[6]/div[3]/div[1]/div[1]/div[4]/div/div/div/div/div/div/div/div/div/div[6]/p')[0].text_content()
    sa_pa_exp = doc.xpath('//*[@id="page"]/div[6]/div[3]/div[1]/div[1]/div[4]/div/div/div/div/div/div/div/div/div/div[8]/p')[0].text_content()

    # print (kural_number)
    # print (kural_number, kural_adhigaram, kural, mu_va_exp, sa_pa_exp)

    df.loc[index] = [kural_number, kural_adhigaram, kural, mu_va_exp, sa_pa_exp]
    index += 1
    print (index)
    

writer = ExcelWriter('thirukkural.xlsx')
df.to_excel(writer,'Sheet5')
writer.save()
print ("done")