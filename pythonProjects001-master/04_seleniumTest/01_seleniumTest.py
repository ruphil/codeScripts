import os
from selenium import webdriver

currentDir = os.getcwd()
envPath = currentDir + "\\00_bin"
os.environ["PATH"] += os.pathsep + os.pathsep.join([envPath])
# print(os.environ["PATH"])

chromeOptions = webdriver.ChromeOptions()
prefs = {"download.default_directory" : "D:/tOut"}
chromeOptions.add_experimental_option("prefs", prefs)

# chromedriver = "00_bin/chromedriver.exe"
# driver = webdriver.Chrome(executable_path=chromedriver, chrome_options=chromeOptions)

driver = webdriver.Chrome(chrome_options=chromeOptions)

driver = webdriver.Chrome()
driver.get("http://www.python.org")

elem = driver.find_element_by_name("q")

# driver.close()