import os
import pandas as pd
import matplotlib.pyplot as plt
import sys
import json
import io

# Obtén los datos JSON de comanda_productes desde los argumentos de la línea de comandos
comanda_productes = json.loads(sys.argv[1])

if not os.path.exists("imatges_stats"):
    os.makedirs("imatges_stats")

df = pd.DataFrame(comanda_productes, columns=["comanda_id", "producte_id", "categoria"])

# Genera un gráfico de barras de las categorías más pedidas
x_values = df['categoria'].value_counts().index
y_values = df['categoria'].value_counts().values
plt.bar(x_values, y_values)

nom_imatge = "comandes_per_producte.png"
plt.savefig(os.path.join("imatges_stats", nom_imatge))
print(f"La imagen se ha guardado como 'imatges_stats/{nom_imatge}'")


#print(pd.DataFrame.to_json(df))