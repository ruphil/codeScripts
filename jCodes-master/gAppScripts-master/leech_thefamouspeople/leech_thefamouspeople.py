import pandas as pd
import requests
from lxml import html
from lxml.html.clean import Cleaner
from pandas import ExcelWriter
import base64
import io
from matplotlib import pyplot as plt
import matplotlib.image as mpimg
import pymysql
import numpy as np

cleaner = Cleaner()
cleaner.javascript = True
cleaner.style = True

def get_category():
    categorys_df = pd.DataFrame(columns=['categories'])
    hp_link = "https://www.thefamouspeople.com/"
    page = requests.get(hp_link)
    doc = html.fromstring(page.content)

    index = 0
    for i in range(1,26):
        x_path = '//*[@id="content"]/div[6]/div/div[2]/div[2]/ul/li[' + str(i) + ']/a'
        category = 'https:' + doc.xpath(x_path)[0].get("href")
        categorys_df.loc[index] = [category]
        # print (category)
        index += 1

    for i in range(1,5):
        x_path = '//*[@id="content"]/div[6]/div/div[2]/div[5]/ul/li[' + str(i) + ']/a'
        category = 'https:' + doc.xpath(x_path)[0].get("href")
        categorys_df.loc[index] = [category]
        # print (category)
        index += 1

    # print (categorys_df)
    writer = ExcelWriter('1_categories.xlsx')
    categorys_df.to_excel(writer,'categories')
    writer.save()
    print ("categories done")
############# get_category ends

def get_profile_links():
    in_file = '2_categories_pages.xlsx'
    categorys_pages_df = pd.read_excel(in_file)
    # print (df)

    profiles_df = pd.DataFrame(columns=['name','profile_page'])

    index = 0
    for i, row in categorys_pages_df.iterrows():
        for j in range(1,row['pages']+1):
            link = str(row['categories']) + "?page=" + str(j)
            print (link)
            page = requests.get(link)
            doc = html.fromstring(page.content)
            for k in range(1,137):
                name_xpath = '//*[@id="relatedDiv"]/div[' + str(k) + ']/div/a[2]/text()'
                link_xpath = '//*[@id="relatedDiv"]/div[' + str(k) + ']/div/a[2]'
                try:
                    name = doc.xpath(name_xpath)
                    profile_link = 'https:' + doc.xpath(link_xpath)[0].get("href")
                    profiles_df.loc[index] = [name, profile_link]
                    # print (index, name, profile_link)
                    index += 1
                except:
                    continue
        print (i, "categories completed")

    writer = ExcelWriter('3_profiles.xlsx')
    profiles_df.to_excel(writer,'profiles')
    writer.save()
    print ("profiles done")
########################33 get profiles ends


def personalities_toDataBase():
    connectionObject = pymysql.connect(host='localhost', user='root', passwd='philosopher', db='important_personalities')
    cursorObject = connectionObject.cursor()

    in_file = '3_profiles.xlsx'
    profiles_df = pd.read_excel(in_file)
    # print(profiles_df)
    break_loop_instance = 0
    for df_row_no, row in profiles_df.iterrows():

        # Column 1
        name = row['name'][2:-2]
        
        # Column 2
        information = ""

        link = row['profile_page']

        # link = profiles_df['profile_page'][1]
        # print (link)
        try:
            page = requests.get(link)
            doc = html.fromstring(cleaner.clean_html(page.content))
        except:
            continue

        quickfacts = ""
        for i in range(1,30):
            try:
                xpath = '//*[@id="idolize"]/div/div[1]/p[' + str(i) + ']'
                quickfacts += doc.xpath(xpath)[0].text_content() + "\n"
            except:
                break

        if (df_row_no % 200 == 0):
            print (df_row_no)
            print(name, link)
        # print (quickfacts)

        information += "QuickFacts:||\n" + quickfacts + "||||\n"

        introduction = ""
        try:
            introduction_xpath = '//*[@id="content"]/div[7]/div/div[1]/div[15]/p/text()'
            introduction = doc.xpath(introduction_xpath)[0]
            # print (introduction)
            information += "Introduction:||\n" + introduction + "||||\n"
        except:
            pass

        try:
            detailed_xpath = '//div[@class="fpf-block"]'
            detailed = doc.xpath(detailed_xpath)[0].text_content()
            # print (detailed)
            detailed_strong_tags_xpath = '//div[@class="fpf-block"]//div//strong'
            detailed_strong_tags = doc.xpath(detailed_strong_tags_xpath)

            tags = np.array([])
            for tag in detailed_strong_tags:
                tag_name = tag.text_content()
                if (len(tag_name) > 2):
                    tags = np.append(tags, str(tag_name))
            # print(tags)

            tag_nos = tags.shape[0]
            # print(tag_nos)
            for idx in range(1,tag_nos):
                temp_text = detailed.split(tags[idx-1])[1].split(tags[idx])[0]
                # print (temp_text)
                information += tags[idx-1] + ":||\n" + temp_text + "||||\n"
                # print (information)
        except:
            pass

        photo_base64 = ""
        try:
            photo_xpath_link = '//*[@id="idolize"]/div/div[2]/div[1]/a/img/@src'
            photo_link = 'https:' + doc.xpath(photo_xpath_link)[0]
            # print (photo_link)

            photo_base64 = base64.b64encode(requests.get(photo_link).content)
            # print (type(photo_base64))
            # print (len(photo_base64))

            # i = base64.b64decode(photo_base64)
            # i = io.BytesIO(i)
            # i = mpimg.imread(i, format='JPG')

            # plt.imshow(i, interpolation='nearest')
            # plt.show()
        except:
            pass

        sqlQuery = "INSERT INTO `personalities` (`name`, `information`, `photo`) VALUES (%s, %s, %s);"
        cursorObject.execute(sqlQuery, (name, information ,photo_base64))
        connectionObject.commit()

        # break_loop_instance += 1
        # if(break_loop_instance > 5):
        #     break

    connectionObject.close()


############################################################################
#### Main Function controller
# 1 getting category
#get_category()

# 2 pages updated manually

# 3 getting profile links
#get_profile_links()

# 4 putting to datastore
personalities_toDataBase()
