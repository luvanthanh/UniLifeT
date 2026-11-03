from pathlib import Path

path = Path(r'D:\ProjectInCV\Project2\UniLifeT\FrontEnd\FrontEndAdmin\javascript\admin.js')
text = path.read_text(encoding='utf-8')
start = text.index('const token = getStoredAdminToken() || adminStore.token;')
end = text.index('const response = await fetch', start)
replacement = '''  const token = getStoredAdminToken() || adminStore.token;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
    adminStore.token = token;
  }

'''
new_text = text[:start] + replacement + text[end:]
path.write_text(new_text, encoding='utf-8')
print('patched')
