from pathlib import Path
import json, hashlib

root=Path(__file__).resolve().parent
brd=root.parents[1]/'Arch'/'scheduler_brd.md'
lines=brd.read_text(encoding='utf-8').splitlines()
claims=[
 ('change','Plans change. / Make room. / Make room for change.','Change management first.','P1 manual planning, positioning statement'),
 ('board','See the whole route.','E4-1','Machine timeline; grouped lanes'),
 ('route','Route connectors / Turning / Milling / CMM inspection','E4-6','Selected-order routing connectors; the inspection in this example is a machine CMM process, not an automatic manual inspection'),
 ('drag','Move one step.','E5-5','Direct human drag, valid time/compatible machine'),
 ('impact','See what follows. / Proposed moves / Before / After','E6-1','Dependent and displaced work preview'),
 ('review','Review. Then commit. / Apply changes / Changes applied','E6-1','Planner must confirm cascade'),
 ('pin','Pinned work stays put. / Pinned / Fixed commitment','E6-2','Immovable pinned work'),
 ('control','Your plan. Your call. / Draft','E9-5','Local editable draft; no live shop-floor publish claim'),
 ('library','Keep the know-how. / Saved routing / Part library','E1-1','Reusable part route'),
 ('repeat','Start from what you know. / New order / Create order / Own routing copy','E2-2','Each new order receives independent route snapshot'),
 ('intake','Part / Quantity / Deadline','E2-1','Part picker and order fields'),
 ('signoff','SOMA / Scheduler / Plan your next move.','P1 goal:','Brand/product name and invitation, no numerical result claim'),
]
facts=[]
for cid,copy,key,note in claims:
 candidates=[(i+1,l) for i,l in enumerate(lines) if key in l]
 if key.startswith('E'):
  candidates=sorted(candidates,key=lambda v:(0 if ('| '+key+' |') in v[1] else 1,len(v[1])))
 number,sentence=candidates[0]
 facts.append(dict(id=cid,on_screen=copy,source_sentence=sentence,source_url='file:///E:/Projects/Soma/Arch/scheduler_brd.md#L'+str(number),source_path=str(brd),source_line=number,note=note))
data={'source':'Arch/scheduler_brd.md','claims':facts,'example_data':{'disclosure':'Illustrative workflow • Example data','order_ids':['OR-025','OR-026','OR-018'],'part':'Diffuser ring','quantity':24,'machines':['NC-01','MC-01','CMM-01'],'days':['Mon','Tue','Wed','Thu','Fri'],'completion_before':'Tue 14:00','completion_after':'Tue 16:00','status':'Illustrative scenario; not customer measurements or a production record'},'omitted_future_features':['Live machine or operator feeds','ERP integrations','Multi-user collaboration','Automatic floor publication','Performance statistics'],'brand_assets':[]}
for p in (root/'assets').glob('logo*'):
 data['brand_assets'].append({'path':str(p),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
(root/'facts.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
names=['Plans change.','Make room.','See the whole route.','Move one step.','See what follows.','Review. Then commit.','Your plan. Your call.','Keep the know-how.','Start from what you know.','Make room for change.']
events=[('unfold',3),('route',6),('reveal',8),('press',9.5),('release',11),('proposal',12),('review',15),('apply',17),('settle',18),('library',21),('new_order',24),('create',25.5),('brand',27),('resolve',28)]
timing={'duration':30,'fps':60,'bpm':120,'beat_seconds':0.5,'beats':[i*.5 for i in range(60)],'drop':8,'voice':[],'scenes':[{'index':i,'start':i*3,'end':(i+1)*3,'title':n} for i,n in enumerate(names)],'actions':[{'name':n,'seconds':s,'frame':round(s*60)} for n,s in events]}
(root/'timing.json').write_text(json.dumps(timing,indent=2),encoding='utf-8')
print('Facts and timeline prepared.')
