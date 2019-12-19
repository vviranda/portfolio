import os
import os.path
from os import path
from bs4 import BeautifulSoup

def build_index():
  with open('src/index.html', 'r') as file :
    filedata = file.read()

  with open('build/portfolio.html', 'r') as file :
    portfolioHtml = file.read()

  # Replace the target string
  filedata = filedata.replace('{@portfolio}', portfolioHtml)

  # Write the file out again
  with open('index.html', 'w') as file:
    file.write(filedata)

def portfolio_item(fileName): 
  link = "projects/{}".format(fileName)

  with open(link, 'r') as file :
      filedata = file.read()

  soup = BeautifulSoup(filedata, 'html.parser')

  image = soup.find('img').get('src')
  if path.exists(image) == False:
    image = ''

  title = soup.find('h2').text
  return """
    <a href="{}" class="portfolio-item" data-target="ajax-portfolio">
        <div class="item-photo">
            <img src="{}" alt="">
        </div>
        <div class="item-overlay">
            <span class="item-title">{}</span>
        </div>
    </a>
  """.format(link,image,title)

def portfolio():
  projects = os.listdir('projects')
  projects = sorted(projects)
  projectsList = ""
  for project in projects:
    tagHtml = portfolio_item(project)
    projectsList += tagHtml
    pass

  with open('src/portfolio.html', 'r') as file :
    filedata = file.read()

  filedata = filedata.replace('@portfolio-list', projectsList)

  with open('build/portfolio.html', 'w') as file:
    file.write(filedata)

if __name__ == "__main__":
  print('start')

  portfolio()
  print('build: portfolio')

  build_index()
  print('build: index')

  print('end')