import os
import pandas as pd
import matplotlib.pyplot as plt
import sys
import json
import io
from datetime import datetime


"""
comanda_productes = [
    {
        "comanda_id": 1,
        "producte_id": 1,
        "categoria": "Pizzes"
    }
  ]
"""

if not os.path.exists("imatges_stats"):
    os.makedirs("imatges_stats")

comanda_productes = (sys.argv[1])

df = pd.read_json(comanda_productes)
#df = pd.DataFrame(comanda_productes, columns=["comanda_id","producte_id","categoria"])
#print(df.head())
#print(df['categoria'])


x_values = df['categoria'].unique()
y_values = df['categoria'].value_counts().tolist()
plt.bar(x_values, y_values)
plt.show()

hora_actual = datetime.now().strftime("%Y%m%d%H%M%S")

nom_imatge = f"imatge_{hora_actual}.png"

# Convertir la imagen a bytes
plt.savefig(os.path.join("imatges_stats", nom_imatge))

print(f"La imagen se ha guardado como 'imatges_stats/{nom_imatge}'")


#print(pd.DataFrame.to_json(df))