import pickle
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import itertools

basepath = 'D:\MASTERS-PROJECT\\'
subBasepath = basepath + 'MTECH-PROJ-master\\'
in_file = subBasepath + 'Soil_Moisture_Berambadi_1617_CropAge_VATI_withMinMaxRSM_SoilClass_out.xlsx'

# Reading from Excel file
SM_ML_df = pd.read_excel(in_file, sheet_name='SM_ML_values')
SM_ML_df.replace(0, np.nan, inplace=True)
SM_ML_df.replace(-np.inf, np.nan, inplace=True)

def get_2D_plots(SM_ML_df):
    plot_IDs_nparray = SM_ML_df['Plot_Id'].unique()
    # print (plot_IDs_nparray.shape)
    # dropping rows with no crop type
    SM_ML_df = SM_ML_df.dropna(axis=0, subset=['rsm_VATI', 'Field_SM'])
    # print (SM_ML_df)
    
    # print (SM_ML_Plot1)
    plot_id = 1001
    fig, ax = plt.subplots(nrows=10, ncols=10, figsize=(15,10))
    fig.text(0.5, 0.005, 'Relative Soil Moisture', fontsize=12, ha='center', va='center')
    fig.text(0.01, 0.5, 'Field Soil Moisture', fontsize=12, ha='center', va='center', rotation='vertical')
    fig.tight_layout()
    for row in ax:
        for col in row:
            while (1070 <= plot_id <= 1081): plot_id += 1
            SM_ML_Plot = SM_ML_df.loc[SM_ML_df['Plot_Id'] == plot_id]
            # print (plot_id, SM_ML_Plot.shape[0])
            col.scatter(SM_ML_Plot['rsm_VATI'], SM_ML_Plot['Field_SM'],s=10)
            col.set_title('Plot Id:'+ str(plot_id))
            plot_id += 1
        #     if (plot_id > 1006): break
        # if (plot_id > 1006): break
    fig.savefig('2Dplots.png', format='png', dpi=300)

def compute_correlation(SM_ML_df):
    plot_IDs_nparray = SM_ML_df['Plot_Id'].unique()
    # print (plot_IDs_nparray.shape)
    # dropping rows with no crop type
    SM_ML_df = SM_ML_df.dropna(axis=0, subset=['rsm_VATI', 'Field_SM'])
    # print (SM_ML_df)
    # print (SM_ML_Plot1)
    plot_id = 1001
    for _ in plot_IDs_nparray:
        SM_ML_Plot = SM_ML_df.loc[SM_ML_df['Plot_Id'] == plot_id]
        plot_id += 1

######################## Master #########################
# get_2D_plots(SM_ML_df)
compute_correlation(SM_ML_df)