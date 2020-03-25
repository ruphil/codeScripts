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

# dropping rows with no crop type
SM_ML_df = SM_ML_df.dropna(axis=0, subset=['Crop_Type'])

# Forming Dictionary for crop Type and replacing with integer in Crop Type Column
Crop_Type_nparray = SM_ML_df['Crop_Type'].str.strip().unique()
int_toCrop_type_dict = dict(enumerate(Crop_Type_nparray))
crop_type_toInt_dict = {y:x for x,y in int_toCrop_type_dict.items()}

SM_ML_df["Crop_Type"] = SM_ML_df["Crop_Type"].str.strip().map(crop_type_toInt_dict)

# column_optional_list = ['Plot_Id','max_RSM','Crop_Period','Crop_Type','Soil_Class']
column_optional_list = ['max_RSM','Crop_Period','Soil_Class']
# column_optional_list = ['max_RSM']
column_mandatory_list = ['rsm_VATI','Field_SM','Crop_Type']

combinations = []
combinations.append([[]])
for i in range(1, len(column_optional_list)+1):
    els = [list(x) for x in itertools.combinations(column_optional_list, i)]
    combinations.append(els)

# Re-Setting Combination Manually
# combinations = []
# combinations.append([['max_RSM','Crop_Period','Soil_Class']])

# print (combinations)
writer = ExcelWriter(subBasepath + '11_performing_Analsis_getting_Crop_Type.xlsx', engine='xlsxwriter')

index = ['Class'+str(i) for i in range(1, len(Crop_Type_nparray)+1)]
Crop_Type_DF = pd.DataFrame(Crop_Type_nparray, index=index)


Crop_Type_DF.to_excel(writer,"Classes",startrow=2, startcol=1)
sheet = writer.sheets["Classes"]
sheet.write('A1', "Classification Algorithm - Comparing Field Soil Moisture and Relative Soil Moisture")
sheet.write('C3', "All Classes")

combo_list = []
# class_groups_df = pd.DataFrame()

comb_count = 1
for temp1 in combinations:
    for comb in temp1:
        columns_loop = list(column_mandatory_list)
        sheetname = 'Combo_' + str(comb_count)
        
        comb_count += 1

        columns_loop.extend(comb)
        print (sheetname, columns_loop)
        Field_SM_VATI = SM_ML_df[columns_loop]
        Field_SM_VATI = Field_SM_VATI.dropna(axis=0, how='any')

        X = Field_SM_VATI.drop(['Crop_Type'], axis=1).values
        y = Field_SM_VATI['Crop_Type'].values
        # print (X.shape, y.shape)

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1)

        clf = []
        clf.extend([AdaBoostClassifier(),BaggingClassifier(),ExtraTreesClassifier(),GradientBoostingClassifier(),RandomForestClassifier()])

        scores = []
        for i, each_clf in enumerate(clf):
            each_clf.fit(X_train, y_train)
            scores.append(each_clf.score(X_test, y_test))

        scores_np = np.array(scores)
        clf_np = np.array(clf)
        # print (scores_np)

        clf_best = clf_np[np.argmax(scores_np)]
        # print("Max Accuracy: ", scores_np.max())
        # print(clf_best)

        category = clf_best.predict(X_test)
        result_DF = pd.DataFrame()
        result_DF['Crop_Type'] = y_test
        result_DF['Class'] = category
        result_DF['Class_int'] = category

        result_DF["Crop_Type"] = result_DF["Crop_Type"].map(int_toCrop_type_dict)
        result_DF["Class"] = result_DF["Class"].map(int_toCrop_type_dict)

        # frames = [class_groups_df, result_DF]
        # class_groups_df = pd.concat(frames, ignore_index=True)

        result_DF.to_excel(writer,sheetname)
        sheet = writer.sheets[sheetname]
        sheet.write('F2', "Combinations:")
        sheet.write('F3', "Best Classifying Algorithm:")
        sheet.write('F4', "Parameters:")
        sheet.write('F5', "Max Accuracy:")

        # sheet.write('I2', str(column_mandatory_list) + " with " + str(comb))
        sheet.write('I2', str(columns_loop))
        sheet.write('I3', str(clf_best))
        sheet.write('I4', str(clf_best.get_params))
        sheet.write('I5', scores_np.max())

        combo_list.append([sheetname, scores_np.max(), str(columns_loop), str(clf_best)])

index = ['Sheet'+str(i+1) for i in range(1, len(combo_list)+1)]
combo_nparray_DF = pd.DataFrame(combo_list, index=index, columns=['Combo_No', 'Accuracy','Combination','Best Classifying Algorithm'])
combo_nparray_DF.sort_values('Accuracy', ascending=False, inplace=True)
combo_nparray_DF.to_excel(writer,"Classes",startrow=2, startcol=5)
writer.save()

# print(class_groups_df)
# writer1 = ExcelWriter(subBasepath + 'Crop_grouping.xlsx', engine='xlsxwriter')
# class_groups_df.to_excel(writer1,'groups')
# writer1.save()
# print ("done totally")
