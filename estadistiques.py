import pandas as pd  # pip install pandas
import matplotlib.pyplot as plt

# pip3 install pandas
import sys
import json

"""
comanda_productes = [
    {
        "comanda_id": 1,
        "producte_id": 1,
        "categoria": "Pizzes"
    }
  ]
"""

comanda_productes = (sys.argv[1])

df = pd.read_json(comanda_productes)
#df = pd.DataFrame(comanda_productes, columns=["comanda_id","producte_id","categoria"])
print(df.head())
print(df['categoria'])


x_values = df['categoria'].unique()
y_values = df['categoria'].value_counts().tolist()
plt.bar(x_values, y_values)
plt.show()
plt.close('all')


#print(pd.DataFrame.to_json(df))