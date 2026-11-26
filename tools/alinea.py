# Alinea la voz de ElevenLabs con el guion sin reconocimiento de voz: silencios (silencedetect) + núcleos silábicos + programación dinámica.
# Uso: python3 tools/alinea.py voz.wav guion_voz.txt > alin.txt   (el guion con etiquetas [..]; se quitan solas)
# Revisa la columna síl/núc: si una fila se desvía mucho, corrige a mano esa línea de alin.txt.
import re,subprocess,sys,numpy as np
from scipy.signal import butter,sosfiltfilt,find_peaks
fn=sys.argv[1]
raw=subprocess.run(['ffmpeg','-v','error','-i',fn,'-ac','1','-ar','16000','-f','f32le','-'],capture_output=True).stdout
x=np.frombuffer(raw,np.float32);sr=16000
# segmentos de habla
o=subprocess.run(['ffmpeg','-i',fn,'-af','silencedetect=noise=-38dB:d=0.12','-f','null','-'],capture_output=True,text=True).stderr
ss=[float(v) for v in re.findall(r'silence_start: ([\d.]+)',o)]; se=[float(v) for v in re.findall(r'silence_end: ([\d.]+)',o)]
dur=len(x)/sr; segs=[];t=0
for a,b in zip(ss,se+[dur]*(len(ss)-len(se))):
    if a-t>0.05: segs.append((t,a))
    t=b
if dur-t>0.1: segs.append((t,dur))
# núcleos silábicos
xb=sosfiltfilt(butter(4,[300,2500],btype='band',fs=sr,output='sos'),x)
hop=160;n=len(xb)//hop;e=np.array([np.sqrt(np.mean(xb[k*hop:(k+1)*hop]**2)) for k in range(n)])
db=20*np.log10(e+1e-9);k=np.ones(5)/5;dbs=np.convolve(db,k,'same')
pk,_=find_peaks(dbs,distance=9,prominence=2.5,height=dbs.max()-30)
pt=pk*hop/sr
nuc=[int(((pt>=a)&(pt<b)).sum()) for a,b in segs]
TXT=open(sys.argv[2]).read()
TXT=re.sub(r'\[[^\]]*\]','',TXT)
chunks=[c.strip() for c in re.split(r'(?:(?<=[,.:;?…])|(?<=[,.:;?…][»”]))\s+',TXT.replace('\n',' ')) if c.strip()]
def syl(s):
    s=s.lower(); s=re.sub(r'[^a-záéíóúüñ ]',' ',s); c=0
    for w in s.split():
        w2=re.sub(r'[iu](?=[aeoáéó])|(?<=[aeoáéó])[iuy](?![aeiouáéíóú])','',w)  # diptongos
        c+=max(1,len(re.findall(r'[aeiouáéíóúü]+',w2)))
    return c
S=[syl(c) for c in chunks]
# DP monotónica: grupos k chunks : 1 seg  o  1 chunk : k segs
INF=1e9;N=len(chunks);M=len(segs)
D=np.full((N+1,M+1),INF);P={};D[0,0]=0
for i in range(N+1):
    for j in range(M+1):
        if D[i,j]>=INF: continue
        for kc in range(1,5):
            for ks in range(1,5):
                if kc>1 and ks>1: continue
                if i+kc>N or j+ks>M: continue
                s=sum(S[i:i+kc]); nn=sum(nuc[j:j+ks])
                c=(nn-s)**2/(s+2)+0.8*(kc-1)+1.5*(ks-1)
                if D[i,j]+c<D[i+kc,j+ks]: D[i+kc,j+ks]=D[i,j]+c;P[(i+kc,j+ks)]=(i,j)
i,j=N,M;path=[]
while (i,j)!=(0,0): pi,pj=P[(i,j)];path.append((pi,i,pj,j));i,j=pi,pj
for pi,i,pj,j in reversed(path):
    print(f'{segs[pj][0]:6.2f}-{segs[j-1][1]:6.2f}  síl {sum(S[pi:i]):2d} núc {sum(nuc[pj:j]):2d} | '+' '.join(chunks[pi:i]))
print('coste',round(D[N,M],1),'segs',M,'chunks',N)
