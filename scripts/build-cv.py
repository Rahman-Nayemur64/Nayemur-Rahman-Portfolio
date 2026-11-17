"""Builds the ATS-friendly CV from the portfolio's JSON data.

    python scripts/build-cv.py        (or double-click scripts/build-cv.bat)

1. Reads data/profile.json, skills.json, projects.json, experience.json, about.json and cv.json
2. Writes cv/cv.html (one-column, plain layout styled by cv/cv.css)
3. Prints it to assets/cv/Nayemur-Rahman-CV.pdf with Microsoft Edge or Google Chrome (headless),
   which gives a real text PDF that applicant-tracking systems can read.
"""
import html
import json
import os
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'data')
HTML_OUT = os.path.join(ROOT, 'cv', 'cv.html')


def load(name):
    with open(os.path.join(DATA, name), encoding='utf-8') as f:
        return json.load(f)


def e(text):
    return html.escape(str(text or ''))


def strip_scheme(url):
    return url.replace('https://', '').replace('http://', '').replace('www.', '').rstrip('/')


def link(url, label=None):
    return '<a href="%s">%s</a>' % (e(url), e(label or strip_scheme(url)))


def section(title, body):
    return '<section><h2>%s</h2>%s</section>' % (e(title), body)


def entry(left, right='', sub='', bullets=None, extra=''):
    out = '<div class="entry"><div class="entry-head"><b>%s</b><span>%s</span></div>' % (left, e(right))
    if sub:
        out += '<div class="entry-sub">%s</div>' % sub
    if bullets:
        out += '<ul>' + ''.join('<li>%s</li>' % e(b) for b in bullets) + '</ul>'
    return out + extra + '</div>'


def build_html():
    profile, skills = load('profile.json'), load('skills.json')
    projects, experience = load('projects.json'), load('experience.json')
    about, cv = load('about.json'), load('cv.json')
    c = profile['contact']

    contact_parts = [e(c.get('location')), e(c.get('phone')), link('mailto:' + c['email'], c['email'])]
    if c.get('linkedin'):
        contact_parts.append(link(c['linkedin'], c.get('linkedinLabel')))
    if c.get('github'):
        contact_parts.append(link(c['github'], c.get('githubLabel')))

    parts = ['<header><h1>%s</h1><div class="title">%s</div><div class="contact">%s</div></header>' % (
        e(profile['name']), e(cv.get('title') or profile.get('headline')), ' | '.join(p for p in contact_parts if p))]

    # Summary
    parts.append(section('Professional Summary', '<p>%s</p>' % e(cv['summary'])))

    # Skills
    parts.append(section('Technical Skills', '<div class="skills">' + ''.join(
        '<p><b>%s:</b> %s</p>' % (e(group), e(', '.join(items))) for group, items in skills['groups'].items()) + '</div>'))

    # Experience (work entries only)
    work = [x for x in experience if x.get('type') == 'work']
    if work:
        bullets_by_name = cv.get('experienceBullets', {})
        parts.append(section('Experience', ''.join(
            entry('%s, %s' % (e(x['role']), e(x['name'])), x['when'],
                  bullets=bullets_by_name.get(x['name']) or [x['description']]) for x in work)))

    # Projects (in the order listed in cv.json)
    by_name = {p['name']: p for p in projects['items']}
    proj_html = ''
    for name in cv.get('projects', []):
        p = by_name.get(name)
        if not p:
            print('  ! cv.json lists a project that is not in projects.json: %s' % name)
            continue
        links = []
        if p.get('demo'):
            links.append(link(p['demo'], 'Live Demo'))
        if p.get('repo'):
            links.append(link(p['repo'], 'GitHub'))
        if p.get('link'):
            links.append(link(p['link']['url'], p['link']['label']))
        head = e(p['name']) + (' | ' + ' | '.join(links) if links else '')
        proj_html += entry(head, '', bullets=p['points'],
                           extra='<div class="tech"><b>Technologies:</b> %s</div>' % e(', '.join(p['tags'])))
    if proj_html:
        parts.append(section('Projects', proj_html))

    # Education + training
    edu_html = ''
    for ed in about['education']:
        edu_html += entry(e(ed['title']), ed['when'], sub=e(ed['detail']))
    parts.append(section('Education & Training', edu_html))

    # Publications
    parts.append(section('Publications', '<ul>' + ''.join(
        '<li>%s. <i>%s</i>. %s</li>' % (e(p['title']), e(p['venue']), link(p['url'])) for p in about['publications']) + '</ul>'))

    # Awards (experience entries of type "award")
    awards = [x for x in experience if x.get('type') == 'award']
    if awards:
        parts.append(section('Awards & Achievements', '<ul>' + ''.join(
            '<li><b>%s</b>, %s (%s). %s</li>' % (e(a['role']), e(a['name']), e(a['when']), e(a['description'])) for a in awards) + '</ul>'))

    return ('<!doctype html><html lang="en"><head><meta charset="utf-8">'
            '<title>%s - CV</title><link rel="stylesheet" href="cv.css"></head><body>%s</body></html>'
            % (e(profile['name']), ''.join(parts)))


def find_browser():
    candidates = [
        r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
        r'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
    ]
    for path in candidates:
        if os.path.exists(path):
            return path
    for name in ('msedge', 'google-chrome', 'chromium', 'chrome'):
        found = shutil.which(name)
        if found:
            return found
    return None


def main():
    profile = load('profile.json')
    pdf_out = os.path.join(ROOT, *profile['cv'].split('/'))

    with open(HTML_OUT, 'w', encoding='utf-8') as f:
        f.write(build_html())
    print('Wrote ' + os.path.relpath(HTML_OUT, ROOT))

    browser = find_browser()
    if not browser:
        print('No Edge or Chrome found. Open cv/cv.html in a browser and use Print > Save as PDF instead.')
        sys.exit(1)

    os.makedirs(os.path.dirname(pdf_out), exist_ok=True)
    url = 'file:///' + HTML_OUT.replace('\\', '/')
    subprocess.run([browser, '--headless=new', '--disable-gpu', '--no-pdf-header-footer',
                    '--print-to-pdf=' + pdf_out, url], check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=120)
    print('Wrote ' + os.path.relpath(pdf_out, ROOT))


if __name__ == '__main__':
    main()
