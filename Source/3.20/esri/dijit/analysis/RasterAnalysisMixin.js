// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.20/esri/copyright.txt for details.
//>>built
define("esri/dijit/analysis/RasterAnalysisMixin","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/_base/json dojo/store/Memory dojo/string dojo/has dojo/dom-class dojo/dom-style dojo/dom-attr ../../kernel ../../lang ./AnalysisBase ./_AnalysisOptions ./utils ../../layers/RasterFunction".split(" "),function(g,b,n,m,f,p,k,q,r,h,t,u,v,w,x,e,l){g=g([x,w],{declaredClass:"esri.dijit.analysis.RasterAnalysisMixin",map:null,outputLayerName:null,resultParameter:"outputRaster",rasterGPToolName:"GenerateRaster",
analysisType:"raster",i18n:null,returnProcessInfo:null,_geometryService:null,constructor:function(a,d){this._pbConnects=[];a.containerNode&&(this.container=a.containerNode)},destroy:function(){this.inherited(arguments);n.forEach(this._pbConnects,m.disconnect);delete this._pbConnects},postMixInProperties:function(){this.inherited(arguments);b.mixin(this.i18n,this.toolNlsName)},postCreate:function(){this.inherited(arguments);r.add(this._form.domNode,"esriSimpleForm");this._outputLayerInput.set("validator",
b.hitch(this,this.validateServiceName));this._buildUI()},startup:function(){console.log("startup")},validateServiceName:function(a){return e.validateServiceName(a,{textInput:this._outputLayerInput})},_getJobParameters:function(){},_getRasterFunction:function(){},_getRasterArguments:function(){},_getOutputItemProperties:function(){},_setDefaultInputs:function(){},_resetUI:function(){},_getDefaultOutputItemProperties:function(a,d,c){d=this._getDefaultRenderingRule(d);var b=this._getDefaultPopupInfo();
return{visibility:!0,opacity:a||1,interpolation:c||"RSP_NearestNeighbor",renderingRule:d,popupInfo:b}},_getDefaultRenderingRule:function(a){var d=new l;d.functionName="Stretch";d.functionArguments={StretchType:5,DRA:!1,Gamma:[1],UseGamma:!0};d.outputPixelType="U8";var c=new l;c.functionName="Colormap";c.functionArguments={colorRamp:a||"Aspect",Raster:d};return c},_getDefaultPopupInfo:function(){return{title:this.get("outputLayerName"),description:null,fieldInfos:[{fieldName:"Raster.ServicePixelValue",
label:"Service Pixel Value",isEditable:!1,isEditableOnLayer:!1,visible:!1,format:{places:2,digitSeparator:!0}},{fieldName:"Raster.ServicePixelValue.Raw",label:"Pixel Value",isEditable:!1,isEditableOnLayer:!1,visible:!0,format:{places:2,digitSeparator:!0}}],showAttachments:!1,layerOptions:{showNoDataRecords:!0},mediaInfos:[]}},_setAnalysisGpServerAttr:function(a){a&&(this.analysisGpServer=a,this.set("toolServiceUrl",this.analysisGpServer+"/"+this.rasterGPToolName))},_setInputLayersAttr:function(a){this.inputLayers=
a},_setInputLayerAttr:function(a){this.inputLayer=a},_getInputLayerAttr:function(){return this.inputLayer},_getOutputLayerNameAttr:function(){this._outputLayerInput&&(this.outputLayerName=this._outputLayerInput.get("value"));return this.outputLayerName},_setOutputLayerNameAttr:function(a){this.outputLayerName=a},_setDisableRunAnalysisAttr:function(a){this._saveBtn.set("disabled",a)},_setDisableExtentAttr:function(a){this._useExtentCheck.set("checked",!a);this._useExtentCheck.set("disabled",a)},_getDisableExtentAttr:function(){this._useExtentCheck.get("disabled")},
_setMapAttr:function(a){this.map=a},_getMapAttr:function(){return this.map},_handleModeCrumbClick:function(a){a.preventDefault();this._onClose(!0)},_onClose:function(a){a&&(this._save(),this.emit("save",{save:!0}));this.emit("close",{save:!a})},_save:function(){},_handleShowCreditsClick:function(a){a.preventDefault();a={};this._form.validate()&&(a.inputLayer=f.toJson(e.constructAnalysisInputLyrObj(this.get("inputLayer"))),a.OutputName=f.toJson({serviceProperties:{name:this.get("outputLayerName")}}),
this.showChooseExtent&&this._useExtentCheck.get("checked")&&(a.context=f.toJson({extent:this.map.extent._normalize(!0)})),this.getCreditsEstimate(this.toolName,a).then(b.hitch(this,function(a){this._usageForm.set("content",a);this._usageDialog.show()})))},_handleSaveBtnClick:function(a){if(this._form.validate()){this._saveBtn.set("disabled",!0);var d=this._webLayerTypeSelect.get("value");a={};var c=this._getJobParameters();if(!v.isDefined(c)){var c={},b={};b.rasterFunction=this._getRasterFunction();
b.rasterFunctionArguments=this._getRasterArguments();c.rasterFunction=f.toJson(b);c.functionArguments=f.toJson({Raster:{url:this.get("inputLayer").url}});if(this.showChooseExtent&&!this.get("disableExtent")&&this._useExtentCheck.get("checked")){var e={},g=this.map.extent._normalize(!0);e.rasterFunction="Clip";e.rasterFunctionArguments={ClippingGeometry:g,ClippingType:1,Extent:g,Raster:b};c.rasterFunction=f.toJson(e)}}c.OutputName=f.toJson({serviceProperties:{name:this.get("outputLayerName")}});c.returnProcessInfo=
this.returnProcessInfo;b={};this.showChooseExtent&&!this.get("disableExtent")&&this._useExtentCheck.get("checked")&&!c.rasterFunction&&(b.extent=this.map.extent._normalize(!0));c.context=f.toJson(b);a.jobParams=c;if("permanentLayer"===d){a.itemParams={description:this.i18n.itemDescription,tags:k.substitute(this.i18n.itemTags,{layername:this.inputLayer.name,fieldname:c.field||"",valuelayername:c.valuelayername||""}),snippet:this.i18n.itemSnippet};if(d=this._getOutputItemProperties())a.itemParams.text=
d;this.showSelectFolder&&(a.itemParams.folder=this.get("folderId"));a.analysisType=this.analysisType;this.execute(a)}else"dynamicLayer"===d&&this._handleSaveDynamicLayer(c)}},_handleSaveDynamicLayer:function(a){this.get("inputLayer");this.analysisGpServer.replace("RasterAnalysisTools/GPServer","RasterRendering/ImageServer?viewId\x3d");f.fromJson(a.OutputName);a=new l;a.functionName=this._getRasterFunction();a.functionArguments=this._getRasterArguments()},_handleAnalysisLayerChange:function(a){"browse"===
a?(this._analysisquery||(this._analysisquery=this._browsedlg.browseItems.get("query")),this._browsedlg.browseItems.set("query",this._analysisquery+' AND tags:"point"'),this._browsedlg.show()):(this.inputLayer=this.inputLayers[a],this._updateAnalysisLayerUI(!0))},_updateAnalysisLayerUI:function(a){this.inputLayer&&(t.set(this._interpolateToolDescription,"innerHTML",k.substitute(this.i18n.toolDefine,{layername:this.inputLayer.name})),a&&(this.outputLayerName=k.substitute(this.i18n.outputLayerName,{layername:this.inputLayer.name})),
this._outputLayerInput.set("value",this.outputLayerName));this._resetUI()},_handleBrowseItemsSelect:function(a){a&&a.selection&&e.addAnalysisReadyLayer({item:a.selection,layers:this.inputLayers,layersSelect:this._analysisSelect,browseDialog:this._browsedlg,widget:this}).always(b.hitch(this,this._updateAnalysisLayerUI,!0))},_buildUI:function(){var a=!0;this._loadConnections();this.signInPromise.then(b.hitch(this,e.initHelpLinks,this.domNode,this.showHelp,{analysisGpServer:this.analysisGpServer,analysisMode:"raster"}));
this.get("showSelectAnalysisLayer")&&(!this.get("inputLayer")&&this.get("inputLayers")&&this.set("inputLayer",this.inputLayers[0]),e.populateAnalysisLayers(this,"inputLayer","inputLayers"));e.addReadyToUseLayerOption(this,[this._analysisSelect]);this.outputLayerName&&(this._outputLayerInput.set("value",this.outputLayerName),a=!1);this.inputLayer&&this._updateAnalysisLayerUI(a);h.set(this._chooseFolderRow,"display",!0===this.showSelectFolder?"block":"none");this.showSelectFolder&&this.getFolderStore().then(b.hitch(this,
function(a){this.folderStore=a;e.setupFoldersUI({folderStore:this.folderStore,folderId:this.folderId,folderName:this.folderName,folderSelect:this._webMapFolderSelect,username:this.portalUser?this.portalUser.username:""})}));this._chooseLayerTypeRow&&(h.set(this._chooseLayerTypeRow,"display",!0===this.showSelectLayerType?"block":"none"),a=new p({data:[{name:this.i18n.permanentLayer,id:"permanentLayer"},{name:this.i18n.dynamicLayer,id:"dynamicLayer"}]}),this._webLayerTypeSelect.set("store",a),this._webLayerTypeSelect.set("value",
"permanentLayer"));h.set(this._chooseExtentDiv,"display",!0===this.showChooseExtent?"inline-block":"none");h.set(this._showCreditsLink,"display",!0===this.showCredits?"block":"none");this._setDefaultInputs()},_loadConnections:function(){this.on("start",b.hitch(this,"_onClose",!1));this._connect(this._closeBtn,"onclick",b.hitch(this,"_onClose",!0))},_connect:function(a,b,c){this._pbConnects.push(m.connect(a,b,c))}});q("extend-esri")&&b.setObject("dijit.analysis.RasterAnalysisMixin",g,u);return g});