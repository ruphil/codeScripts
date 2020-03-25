import numpy as np
import pandas as pd
import os
from datetime import datetime, timedelta
from osgeo import gdal, osr
from qgis.core import QgsRasterLayer
from pandas import ExcelWriter

basepath = 'D:\MASTERS-PROJECT\\'
subBasepath = basepath + 'MTECH-PROJ-Prob_1_VATI_vs_Field_Moisture\\'
in_file = subBasepath + 'Soil_Moisture_Berambadi_1617_CropAge_VATI_out.xlsx'
out_file = subBasepath + 'Soil_Moisture_Berambadi_1617_CropAge_VATI_withMinMaxRSM_out.xlsx'

sm_folder = 'D:\MASTERS-PROJECT\sm_VATI\\'

SM_ML_df = pd.read_excel(in_file, sheet_name='SM_ML_values')

RSM_minmax_DF = SM_ML_df[['Plot_Id', 'Latitude', 'Longitude']]

RSM_minmax_DF.drop_duplicates(subset=['Plot_Id'], keep='first', inplace=True)
RSM_minmax_DF.reset_index(drop=True, inplace=True)

# print (RSM_max_DF.shape[0])

rsm_Max_npArray = np.zeros(RSM_minmax_DF.shape[0])
rsm_Min_npArray = np.zeros(RSM_minmax_DF.shape[0])

folder = os.listdir(sm_folder)
fldr_len = len(folder)
for ij, each_file in enumerate(folder):
    if (ij % 30 ==0):
        print (ij, "completed")
    if '.tif' in each_file and '.xml' not in each_file:
        file_fullPath = sm_folder + each_file
        # print (file_fullPath)
        for index, row in RSM_minmax_DF.iterrows():
            # print (index)
            rlayer_rsm = QgsRasterLayer(file_fullPath)
            rsm_ds = gdal.Open(file_fullPath)

            prj = rsm_ds.GetProjectionRef()
            srs = osr.SpatialReference(wkt=prj)
            EPSG_num = srs.GetAttrValue('authority', 1)

            crsSrc = QgsCoordinateReferenceSystem(4326)      # WGS 84
            crsDest = QgsCoordinateReferenceSystem(int(EPSG_num))   # WGS 84 / UTM zone 43N
            xform = QgsCoordinateTransform(crsSrc, crsDest)

            pt_gps = QgsPoint(float(row['Longitude']), float(row['Latitude']))
            pt_meter = xform.transform(pt_gps)

            RSM = rlayer_rsm.dataProvider().identify(pt_meter, QgsRaster.IdentifyFormatValue)
            if (RSM.isValid()):
                if not RSM.results()[1] == None:
                    rsm_val = RSM.results()[1]
                    if(rsm_Max_npArray[index] < rsm_val):
                        rsm_Max_npArray[index] = rsm_val
                    if(rsm_Min_npArray[index] > rsm_val):
                        rsm_Min_npArray[index] = rsm_val

RSM_minmax_DF['min_RSM'] = rsm_Min_npArray
RSM_minmax_DF['max_RSM'] = rsm_Max_npArray

SM_ML_df['min_RSM'] = SM_ML_df['Plot_Id'].map(RSM_minmax_DF.set_index('Plot_Id')['min_RSM'])
SM_ML_df['max_RSM'] = SM_ML_df['Plot_Id'].map(RSM_minmax_DF.set_index('Plot_Id')['max_RSM'])

print ("writing to excel")
writer = ExcelWriter(out_file)
SM_ML_df.to_excel(writer,'SM_ML_values')
writer.save()
print ("done totally")