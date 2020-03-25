import pickle
import numpy as np
import pandas as pd
import os, os.path
from datetime import datetime, timedelta
from pandas import ExcelWriter
from openpyxl import load_workbook
from osgeo import gdal, osr
from qgis.core import QgsRasterLayer

basepath = 'D:\MASTERS-PROJECT\\'
subBasepath = basepath + 'MTECH-PROJ-Prob_1_VATI_vs_Field_Moisture\\'
in_file = subBasepath + 'Soil_Moisture_Berambadi_1617_CropAge_out.xlsx'
out_file = subBasepath + 'Soil_Moisture_Berambadi_1617_CropAge_VATI_out.xlsx'

sm_folder = 'D:\MASTERS-PROJECT\sm_VATI\\'

SM_ML_df = pd.read_excel(in_file, sheet_name='SM_ML_values')

SM_ML_Dates_df = SM_ML_df[['Date']]
SM_ML_Dates_df.drop_duplicates(subset=['Date'], keep='first', inplace=True)
SM_ML_Dates_df.reset_index(drop=True, inplace=True)

# print (SM_ML_Dates_df)

sm_VATI_LatLon_DF = SM_ML_df[['Plot_Id', 'Latitude', 'Longitude']]

sm_VATI_LatLon_DF.drop_duplicates(subset=['Plot_Id'], keep='first', inplace=True)
sm_VATI_LatLon_DF.reset_index(drop=True, inplace=True)

for index, SM_ML_Dates_df_row in SM_ML_Dates_df.iterrows():
    date_dfval = SM_ML_Dates_df_row['Date']
    date = str(date_dfval)
    date = datetime.strptime(date, '%Y-%m-%d %H:%M:%S')
    date = date.strftime('%Y%m%d')
    file_fullPath = sm_folder + date + '.tif'
    if(os.path.isfile(file_fullPath)):
        # print (date)
        raster_ds = gdal.Open(file_fullPath)
        rlayer = QgsRasterLayer(file_fullPath)

        geoTrans = raster_ds.GetGeoTransform()
        ulX = geoTrans[0]
        ulY = geoTrans[3]
        pxUnitX = geoTrans[1]
        pxUnitY = geoTrans[5] # this value is -ve

        prj = raster_ds.GetProjectionRef()
        srs = osr.SpatialReference(wkt=prj)
        EPSG_num = srs.GetAttrValue('authority', 1)

        crsSrc = QgsCoordinateReferenceSystem(4326)      # WGS 84
        crsDest = QgsCoordinateReferenceSystem(int(EPSG_num))   # WGS 84 / UTM zone 43N
        xform = QgsCoordinateTransform(crsSrc, crsDest)

        sm_VATI_nparray = np.array([])
        # print (sm_VATI_LatLon_DF.shape[0])
        for index, sm_VATI_LatLon_DF_row in sm_VATI_LatLon_DF.iterrows():
            pt_gps = QgsPoint(float(sm_VATI_LatLon_DF_row['Longitude']), float(sm_VATI_LatLon_DF_row['Latitude']))
            pt_meter = xform.transform(pt_gps)
            # print (pt_meter)
            sm = rlayer.dataProvider().identify(pt_meter, QgsRaster.IdentifyFormatValue)
            sm_val = sm.results()[1]
            # print (sm_val)
            sm_VATI_nparray = np.append(sm_VATI_nparray, sm_val)

        # print (sm_VATI_nparray.shape)
        sm_VATI_LatLon_DF['sm_VATI'] = sm_VATI_nparray
        # print (sm_VATI_LatLon_DF.head())

        for index, sm_VATI_LatLon_DF_row in sm_VATI_LatLon_DF.iterrows():
            Plot_Id_val = sm_VATI_LatLon_DF_row['Plot_Id']
            SM_ML_df.loc[(SM_ML_df['Plot_Id'] == Plot_Id_val) & (SM_ML_df['Date'] == date_dfval), 'sm_VATI'] = sm_VATI_LatLon_DF_row['sm_VATI']

        # print (SM_ML_df['Plot_Id'].map(sm_VATI_LatLon_DF.set_index('Plot_Id')['sm_VATI']))

        # SM_ML_df.insert(16, 'sm_VATI', SM_ML_df['Plot_Id'].map(sm_VATI_LatLon_DF.set_index('Plot_Id')['sm_VATI']))
        # SM_ML_df['sm_VATI'] = SM_ML_df['Plot_Id'].map(sm_VATI_LatLon_DF)
        # print (sm_VATI_LatLon_DF)
        # print (SM_ML_df.head())
    
    # count += 1
    # if(count>15):
    #     break
    
writer = ExcelWriter(out_file)
SM_ML_df.to_excel(writer,'SM_ML_values')
writer.save()

print ("done totally")



# print (sm_VATI_LatLon_DF.shape[0])

# files = os.listdir(sm_folder)
# count = 1
# for _, file in enumerate(files):
#     filename, file_extension = os.path.splitext(file)
#     if (file_extension == ".tif"):

#         date = datetime.strptime(filename, '%Y%m%d')
#         date = date.strftime('%Y-%m-%d %H:%M:%S')
#         print (date)

#         in_file = sm_folder + file
