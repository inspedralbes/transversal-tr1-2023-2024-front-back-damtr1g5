import os
import pandas as pd
import matplotlib.pyplot as plt
import sys
import json

comanda_productes = json.loads(sys.argv[1])

if not os.path.exists("imatges_stats"):
    os.makedirs("imatges_stats")

# Convertir el campo cost_total a valores numéricos en el JSON
for comanda in comanda_productes:
    comanda['cost_total'] = float(comanda['cost_total'])

df = pd.DataFrame(comanda_productes)

# Genera un gráfico de barras de las categorías más pedidas
x_values = df['categoria'].value_counts().index
y_values = df['categoria'].value_counts().values
plt.figure(figsize=(12, 5))  
plt.bar(x_values, y_values)
plt.xlabel('Categorías')
plt.ylabel('Número de Comandas')
plt.title("Estadistica comandes per categoria")

nom_imatge_categorias = "comandes_per_producte.png"
image_path_categorias = os.path.join("imatges_stats", nom_imatge_categorias)
plt.savefig(image_path_categorias)
plt.close()  

# Genera un gráfico de barras de las horas a las que se realizan más comandas
hour_values = df['hora_comanda'].value_counts().index
hour_counts = df['hora_comanda'].value_counts().values
plt.figure(figsize=(12, 5))  
plt.bar(hour_values, hour_counts)
plt.xlabel('Horas de Comanda')
plt.ylabel('Número de Comandas')
plt.title("Estadistica comandes per hores") 

nom_imatge_horas = "comandes_por_horas.png"
image_path_horas = os.path.join("imatges_stats", nom_imatge_horas)
plt.savefig(image_path_horas)
plt.close()  

# Genera un gráfico del costo total de las comandas por hora
hour_values = df['hora_comanda'].value_counts().index
cost_values = df.groupby('hora_comanda')['cost_total'].sum()
plt.figure(figsize=(12, 5)) 
plt.bar(hour_values, cost_values)
plt.xlabel('Hora de Comanda')
plt.ylabel('Recaudació €')
plt.title("Recaudación por hora")

nom_imatge_recaudacion = "recaudacio_per_hores.png"
image_path_recaudacion = os.path.join("imatges_stats", nom_imatge_recaudacion)
plt.savefig(image_path_recaudacion)
plt.close()

sys.stdout.write(image_path_categorias + "\n" + image_path_horas + "\n" + image_path_recaudacion)
