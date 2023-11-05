import os
import pandas as pd
import matplotlib.pyplot as plt
import sys
import json

comanda_productes = json.loads(sys.argv[1])

if not os.path.exists("imatges_stats"):
    os.makedirs("imatges_stats")

df = pd.DataFrame(comanda_productes, columns=["comanda_id", "producte_id", "categoria", "hora_comanda"])

# Genera un gráfico de barras de las categorías más pedidas
x_values = df['categoria'].value_counts().index
y_values = df['categoria'].value_counts().values
plt.figure(figsize=(12, 5))  # Ajusta el tamaño de la figura
plt.bar(x_values, y_values)
plt.title("Estadistica comandes per producte")

nom_imatge_categorias = "comandes_per_producte.png"
image_path_categorias = os.path.join("imatges_stats", nom_imatge_categorias)
plt.savefig(image_path_categorias)
plt.close()  

# Genera un gráfico de barras de las horas a las que se realizan más comandas
hour_values = df['hora_comanda'].value_counts().index
hour_counts = df['hora_comanda'].value_counts().values
plt.figure(figsize=(12, 5))  # Crea una nueva figura
plt.bar(hour_values, hour_counts)
plt.title("Estadistica comandes per hores") 

nom_imatge_horas = "comandes_por_horas.png"
image_path_horas = os.path.join("imatges_stats", nom_imatge_horas)
plt.savefig(image_path_horas)
plt.close()  

sys.stdout.write(image_path_categorias + "\n" + image_path_horas)
