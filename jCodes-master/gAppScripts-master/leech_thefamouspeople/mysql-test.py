import pymysql
import base64
import io
from matplotlib import pyplot as plt
import matplotlib.image as mpimg

connectionObject = pymysql.connect(host='localhost', user='root', passwd='philosopher', db='important_personalities')
cursorObject        = connectionObject.cursor()

# sqlQuery = "ALTER TABLE `personalities` ADD `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY;"
# cursorObject.execute(sqlQuery)

# sqlQuery = "DROP TABLE personalities;"
# cursorObject.execute(sqlQuery)
# sqlQuery            = "CREATE TABLE personalities(name TINYTEXT, information TEXT, photo TEXT);"   
# cursorObject.execute(sqlQuery)

# sqlQuery = "SHOW TABLES;"
# cursorObject.execute(sqlQuery)
# rows = cursorObject.fetchall()
# for row in rows:
#     print(row)

# sqlQuery = "INSERT INTO `personalities` (`name`, `information`, `photo`) VALUES (%s, %s, %s);"
# cursorObject.execute(sqlQuery, ('muttal','muttalal dhan' ,'mokka' ))
# connectionObject.commit()

# sqlQuery = "SELECT name,photo FROM personalities LIMIT 3;"
# cursorObject.execute(sqlQuery)
# rows = cursorObject.fetchall()
# for row in rows:
#     # print(row[0])
#     i = base64.b64decode(row[1])
#     i = io.BytesIO(i)
#     i = mpimg.imread(i, format='JPG')

#     plt.figure()
#     plt.imshow(i, interpolation='nearest')
#     plt.title(row[0])
# plt.show()

# sqlQuery = "SELECT COUNT(name) FROM personalities"
# cursorObject.execute(sqlQuery)
# result = cursorObject.fetchone()
# number_of_rows = result[0]
# print (number_of_rows)

connectionObject.close()
