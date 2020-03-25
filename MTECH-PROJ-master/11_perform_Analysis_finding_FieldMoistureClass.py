import pickle
import numpy as np
import pandas as pd
from pandas import ExcelWriter
import matplotlib.pyplot as plt
import itertools

from sklearn.model_selection import train_test_split

from sklearn.ensemble import AdaBoostClassifier,BaggingClassifier,ExtraTreesClassifier,GradientBoostingClassifier,RandomForestClassifier

basepath = 'D:\MASTERS-PROJECT\\'
subBasepath = basepath + 'MTECH-PROJ-Prob_1_VATI_vs_Field_Moisture\\'
in_file = subBasepath + 'Soil_Moisture_Berambadi_1617_CropAge_VATI_withMinMaxRSM_SoilClass_out.xlsx'

# Reading from Excel file
SM_ML_df = pd.read_excel(in_file, sheet_name='SM_ML_values')
SM_ML_df.replace(0, np.nan, inplace=True)
SM_ML_df.replace(-np.inf, np.nan, inplace=True)


# Replacing with crop classes
crop_class_file = subBasepath + 'Crop_Classes.xlsx'
crop_class_df = pd.read_excel(crop_class_file, sheet_name='crop_classes')
# print (crop_class_df)

replacing_dict = {}
for index, each_row in crop_class_df.iterrows():
    # print (each_row, type(each_row))
    replacing_dict[each_row['Crop_Type']] = 'class' + str(each_row['Crop_Class'])
# print (replacing_dict)

SM_ML_df["Crop_Type"] = SM_ML_df["Crop_Type"].str.strip().replace(replacing_dict)
# print (SM_ML_df)

# dropping rows with no crop type
SM_ML_df = SM_ML_df.dropna(axis=0, subset=['Crop_Type'])

# Forming Dictionary for crop Type and replacing with integer in Crop Type Column
Crop_Type_nparray = SM_ML_df['Crop_Type'].str.strip().unique()
# print (Crop_Type_nparray)

int_toCrop_type_dict = dict(enumerate(Crop_Type_nparray))
crop_type_toInt_dict = {y:x for x,y in int_toCrop_type_dict.items()}
# print (int_toCrop_type_dict)

SM_ML_df["Crop_Type"] = SM_ML_df["Crop_Type"].str.strip().map(crop_type_toInt_dict)

SM_ML_df['Mapped_Field_SM'] = SM_ML_df['Field_SM']
# SM_ML_df = SM_ML_df.dropna(axis=0, how='any')

# Mapping Function for Field Soil Moisture into Integer Class
max_val = 60
interval = 3
no_of_intervals = int(max_val/interval)

def func(x):
    if x <= max_val:
        return int(x/interval)
    elif x > max_val:
        return no_of_intervals
    else:
        return np.nan

int_Class_toFieldMoistureClass_dict = {}
last_key = 0
for i in range(no_of_intervals):
    int_Class_toFieldMoistureClass_dict[i] = str(i*interval) + 't' + str((i+1)*interval)
    last_key = i
int_Class_toFieldMoistureClass_dict[last_key+1] = 'gt60'
int_Class_toFieldMoistureClass_dict[last_key+2] = 'NA'

# print (int_Class_toFieldMoistureClass_dict)

SM_ML_df['Mapped_Field_SM'] = SM_ML_df['Mapped_Field_SM'].map(func)
# print (SM_ML_df.head())

# column_optional_list = ['Plot_Id','max_RSM','Crop_Period','Crop_Type','Soil_Class']
column_optional_list = ['max_RSM','Crop_Period','Crop_Type','Soil_Class']
# column_optional_list = ['max_RSM']
column_mandatory_list = ['rsm_VATI','Field_SM','Mapped_Field_SM']

combinations = []
combinations.append([[]])
for i in range(1, len(column_optional_list)+1):
    els = [list(x) for x in itertools.combinations(column_optional_list, i)]
    combinations.append(els)

# Re-Setting Combination Manually
# combinations = []
# combinations.append([['max_RSM','Crop_Type','Crop_Period','Soil_Class']])

writer = ExcelWriter(subBasepath + '11_performing_Analsis_getting_Field_Soil_Moisture_Class.xlsx', engine='xlsxwriter')

# print (int_Class_toFieldMoistureClass_dict)

Field_Moisture_Class_DF = pd.DataFrame.from_dict(int_Class_toFieldMoistureClass_dict, orient='index')

Field_Moisture_Class_DF.to_excel(writer,"Classes",startrow=2,startcol=1)
sheet = writer.sheets["Classes"]
sheet.write('A1', "Classification Algorithm - Finding Field Soil Moisture Class from Relative Soil Moisture (from SWIR bands)")
sheet.write('C3', "All Classes")

combo_list = []

class_groups_df = pd.DataFrame()

comb_count = 1
for temp1 in combinations:
    for comb in temp1:
        columns_loop = list(column_mandatory_list)
        sheetname = 'Combo_' + str(comb_count)
        
        columns_loop.extend(comb)
        print (sheetname, columns_loop)
        Field_SM_VATI = SM_ML_df[columns_loop]
        Field_SM_VATI = Field_SM_VATI.dropna(axis=0, how='any')

        X = Field_SM_VATI.copy()
        y = Field_SM_VATI['Mapped_Field_SM']
        # print (X.shape, y.shape)

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1)
        
        X_test_Field_SM = X_test['Field_SM']
        
        X_train = X_train.drop(['Field_SM','Mapped_Field_SM'], axis=1)
        X_test = X_test.drop(['Field_SM','Mapped_Field_SM'], axis=1)

    #     print (X_train)

    #     break
    # break

        X_train = X_train.values
        y_train = y_train.values
        X_test = X_test.values

        clf = []
        clf.extend([AdaBoostClassifier(),BaggingClassifier(),ExtraTreesClassifier(),GradientBoostingClassifier(),RandomForestClassifier()])

        scores = []
        for i, each_clf in enumerate(clf):
            each_clf.fit(X_train, y_train)
            scores.append(each_clf.score(X_test, y_test))

        # print (scores)

        scores_np = np.array(scores)
        clf_np = np.array(clf)
        # print (scores_np)

        clf_best = clf_np[np.argmax(scores_np)]
        # print("Max Accuracy: ", scores_np.max())
        # print(clf_best)

        category = clf_best.predict(X_test)
        result_DF = pd.DataFrame()
        result_DF['Field_SM'] = X_test_Field_SM

        result_DF['Field_SM'] = SM_ML_df['Field_SM'].map(func)
        result_DF['Field_SM'] = result_DF['Field_SM'].map(int_Class_toFieldMoistureClass_dict)

        category = np.rint(category)
        # print (category,type(category))

        result_DF['SM_Class'] = category
        result_DF['Class_int'] = category

        result_DF['SM_Class'] = result_DF['SM_Class'].map(int_Class_toFieldMoistureClass_dict)

        result_DF.to_excel(writer,sheetname)
        sheet = writer.sheets[sheetname]
        sheet.write('F2', "Combinations:")
        sheet.write('F3', "Best Classifying Algorithm:")
        sheet.write('F4', "Parameters:")
        sheet.write('F5', "Max Accuracy:")

        sheet.write('I2', str(column_mandatory_list) + " with " + str(comb))
        sheet.write('I2', str(columns_loop))
        sheet.write('I3', str(clf_best))
        sheet.write('I4', str(clf_best.get_params))
        sheet.write('I5', scores_np.max())

        combo_list.append([sheetname, scores_np.max(), str(columns_loop), str(clf_best)])

        comb_count += 1
    #     if (comb_count > 1):
    #         break
    # break
     
index = ['Sheet'+str(i+1) for i in range(1, len(combo_list)+1)]
combo_nparray_DF = pd.DataFrame(combo_list, index=index, columns=['Combo_No', 'Accuracy','Combination','Best Classifying Algorithm'])
combo_nparray_DF.sort_values('Accuracy', ascending=False, inplace=True)
combo_nparray_DF.to_excel(writer,"Classes",startrow=2, startcol=5)
writer.save()


print ("done totally")
