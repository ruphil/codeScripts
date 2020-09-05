import os 

# print(os.environ['USE_PATH_FOR_GDAL_PYTHON'])
# os.environ['GDAL_DRIVER_PATH']
# print(os.environ['GDAL_DATA'])
# print(os.environ)

print(os.system("gdalinfo"))

import fiona 
# import geopandas as gpd

# gdb_file = "D:\GIS\MGP_New.gdb"
# # Get all the layers from the .gdb file 
# layers = fiona.listlayers(gdb_file)
# print(layers)

# print(fiona.supported_drivers)

# import os
# from osgeo import ogr

# print(os.path.join(os.path.dirname(__file__), 'gdalplugins'))
# os.environ['USE_PATH_FOR_GDAL_PYTHON'] = os.path.join(os.path.dirname(__file__), 'gdalplugins')
# os.environ['GDAL_DRIVER_PATH'] = os.path.join(os.path.dirname(__file__), 'gdalplugins')

# driver = ogr.GetDriverByName("FileGDB")
# print(driver)

# import gdal


# driver_list = []
# for i in range(gdal.GetDriverCount()):
#     driver = gdal.GetDriver(i)

#     desc = driver.GetDescription()
#     if (desc)
#     driver_list.append()

# driver_list.sort()

# print(driver_list)



# driver1 = ogr.GetDriverByName("OpenFileGDB")
# print(driver1)

# ds = driver.Open(r"D:\GIS\MGP_New.gdb", 0)