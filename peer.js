[33mcommit fa0b514e771940cded5d3edbbdd1326c9614f284[m
Author: Ravi-Sinhmar <engineerfuture82@gmail.com>
Date:   Sat Oct 12 00:34:41 2024 +0530

    lets done'

[1mdiff --git a/src/Contexts/Peer.jsx b/src/Contexts/Peer.jsx[m
[1mindex 6158800..7c28068 100644[m
[1m--- a/src/Contexts/Peer.jsx[m
[1m+++ b/src/Contexts/Peer.jsx[m
[36m@@ -57,7 +57,12 @@[m [mconst handleSendVideo = useCallback(async(event)=>{[m
   console.log("GOT TRACKS!!",video[0]);[m
 [m
   setRemoteStream(video[0]);[m
[31m-},[])[m
[32m+[m[32m},[]);[m
[32m+[m
[32m+[m
[32m+[m[32museEffect(()=>{[m
[32m+[m[32mhandleSendVideo();[m
[32m+[m[32m},[handleSendVideo])[m
 [m
 useEffect(()=>{[m
   peer.addEventListener('track',handleSendVideo);[m
