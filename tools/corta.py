# Corta la voz por escenas a partir de alin.txt y deja clips WAV + alineacion.json para timeline.ts.
# Uso: python3 tools/corta.py voz.wav alin.txt '[["01-gancho","Hay dos"],["02-dato","En dos mil"]]' public/voz/<slug>
# Cada escena empieza en la primera frase de alin.txt que empieza por ese texto; lo anterior (calentamiento) se descarta.
# Silencios recortados a 0,30 s (salvo tras «...»), micro-fundidos de 8 ms. El audio no se procesa.
import re,json,subprocess,sys,os,numpy as np
wav,alin,esc,outdir=sys.argv[1:5]
ESC=json.loads(esc)
rows=[]
for l in open(alin):
    m=re.match(r'\s*([\d.]+)-\s*([\d.]+)\s+síl.*?\| (.*)',l)
    if m: rows.append([float(m[1]),float(m[2]),m[3]])
starts=[next(i for i,r in enumerate(rows) if r[2].startswith(k)) for _,k in ESC]+[len(rows)]
raw=subprocess.run(['ffmpeg','-v','error','-i',wav,'-f','f32le','-ac','1','-ar','48000','-'],capture_output=True).stdout
x=np.frombuffer(raw,np.float32);sr=48000
PRE,POST,CAP=0.06,0.10,0.30
out={};os.makedirs(outdir,exist_ok=True)
for (name,_),a,b in zip(ESC,starts[:-1],starts[1:]):
    parts=[];t=0;subs=[]
    for i in range(a,b):
        s,e,txt=rows[i]
        if i>a:
            gap=s-rows[i-1][1]
            keep=gap if rows[i-1][2].endswith('...') else min(gap,CAP)
            z=max(0,keep-PRE-POST); parts.append(np.zeros(int(z*sr),np.float32)); t+=z
        seg=x[max(0,int((s-PRE)*sr)):int((e+POST)*sr)].copy(); r=int(0.008*sr); seg[:r]*=np.linspace(0,1,r); seg[-r:]*=np.linspace(1,0,r)
        subs.append({'from':round(t+PRE,3),'to':round(t+PRE+(e-s),3),'text':txt}); parts.append(seg); t+=len(seg)/sr
    y=np.concatenate(parts)
    subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar','48000','-ac','1','-i','-','-c:a','pcm_s24le',f'{outdir}/{name}.wav'],input=y.tobytes())
    out[name]={'dur':round(len(y)/sr,3),'subs':subs}
json.dump(out,open(f'{outdir}/alineacion.json','w'),ensure_ascii=False,indent=1)
for k,v in out.items(): print(f"{k:16s} {v['dur']:5.2f} s")
print('voz total',round(sum(v['dur'] for v in out.values()),2),'s')
