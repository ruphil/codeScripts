import numpy as np
import pandas as pd
from pandas import ExcelWriter

basepath = 'D:\MASTERS-PROJECT\\'
subBasepath = basepath + 'MTECH-PROJ-Prob_1_VATI_vs_Field_Moisture\\'
in_file = subBasepath + 'Soil_Moisture_Berambadi_1617_CropAge_VATI_withMinMaxRSM_out.xlsx'
out_file = subBasepath + 'Soil_Moisture_Berambadi_1617_CropAge_VATI_withMinMaxRSM_SoilClass_out.xlsx'

soil_class_file = subBasepath + 'Soil_Classes.xlsx'

soil_class_df = pd.read_excel(soil_class_file, sheet_name='soil_classes')
soil_class_df = soil_class_df[['longitude','latitude','Int_Type']]
# print (soil_class_df)

SM_ML_df = pd.read_excel(in_file, sheet_name='SM_ML_values')

sm_Soil_Class_LatLon_DF = SM_ML_df[['Plot_Id', 'Latitude', 'Longitude']]
sm_Soil_Class_LatLon_DF = sm_Soil_Class_LatLon_DF.drop_duplicates(subset=['Plot_Id'], keep='first')
sm_Soil_Class_LatLon_DF.reset_index(drop=True, inplace=True)
# print (sm_Soil_Class_LatLon_DF.shape)

soil_found_class_nparray = np.empty(shape=sm_Soil_Class_LatLon_DF.shape[0])
soil_found_class_nparray[:] = np.nan
# print (soil_found_class_nparray.shape)

count = 1
for i, SM_row in sm_Soil_Class_LatLon_DF.iterrows():
    sm_longitude = SM_row['Longitude']
    sm_latitude = SM_row['Latitude']

    left_extent_arry = np.array([])
    right_extent_arry = np.array([])
    for j, Class_row in soil_class_df.iterrows():
        if sm_longitude >= Class_row['longitude']:
            left_extent_arry = np.append(left_extent_arry, j)
        if sm_longitude <= Class_row['longitude']:
            right_extent_arry = np.append(right_extent_arry, j)
    
    if (left_extent_arry.shape[0] != 0):  
        left_extent_j = left_extent_arry.max()
    else:
        left_extent_j = None
    if (right_extent_arry.shape[0] != 0):  
        right_extent_j = right_extent_arry.min()
    else:
        right_extent_j = None

    # print (sm_longitude, left_extent_j, right_extent_j)
    if (left_extent_j != None and right_extent_j != None):
        top_extent_arry = np.array([])
        bottom_extent_arry = np.array([])
        
        for jk, Class_row in soil_class_df.iterrows():
            if (right_extent_j >= jk >= left_extent_j):
                if sm_latitude >= Class_row['latitude']:
                    bottom_extent_arry = np.append(bottom_extent_arry, jk)
                if sm_latitude <= Class_row['latitude']:
                    top_extent_arry = np.append(top_extent_arry, jk)

        if (top_extent_arry.shape[0] != 0):  
            LT_extent_jk = top_extent_arry.min()
        else:
            LT_extent_jk = None
        if (bottom_extent_arry.shape[0] != 0):  
            RT_extent_jk = bottom_extent_arry.max()
        else:
            RT_extent_jk = None

        # taking left top value for soil
        if (LT_extent_jk != None and RT_extent_jk != None):
            soil_found_class_nparray[i] = int(soil_class_df['Int_Type'].iloc[int(LT_extent_jk)])
    else:
        soil_found_class_nparray[i] = np.nan

sm_Soil_Class_LatLon_DF['Int_Type'] = soil_found_class_nparray

SM_ML_df['Soil_Class'] = SM_ML_df['Plot_Id'].map(sm_Soil_Class_LatLon_DF.set_index('Plot_Id')['Int_Type'])

print ("writing to excel")
writer = ExcelWriter(out_file)
SM_ML_df.to_excel(writer,'SM_ML_values')
writer.save()
print ("done totally")