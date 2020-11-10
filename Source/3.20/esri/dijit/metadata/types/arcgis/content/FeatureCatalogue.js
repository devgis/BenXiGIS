// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.20/esri/copyright.txt for details.
//>>built
require({cache:{"url:esri/dijit/metadata/types/arcgis/content/templates/FeatureCatalogue.html":'\x3cdiv data-dojo-attach-point\x3d"containerNode"\x3e\r\n  \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/OpenElement"\r\n    data-dojo-props\x3d"target:\'FetCatDesc\',minOccurs:0,showHeader:false,label:\'${i18nArcGIS.contInfo.FetCatDesc.caption}\'"\x3e\r\n    \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/Tabs"\x3e\r\n    \r\n      \x3c!-- description --\x3e\r\n      \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/Section"\r\n        data-dojo-props\x3d"showHeader:false,label:\'${i18nArcGIS.contInfo.FetCatDesc.section.description}\'"\x3e\r\n        \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/OpenElement"\r\n          data-dojo-props\x3d"target:\'compCode\',minOccurs:0,showHeader:false"\x3e\r\n          \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/types/arcgis/form/InputCheckBox"\r\n            data-dojo-props\x3d"label:\'${i18nArcGIS.contInfo.FetCatDesc.compCode}\'"\x3e\r\n          \x3c/div\x3e  \r\n        \x3c/div\x3e  \r\n        \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/OpenElement"\r\n          data-dojo-props\x3d"target:\'incWithDS\',minOccurs:0,showHeader:false"\x3e\r\n          \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/types/arcgis/form/InputCheckBox"\r\n            data-dojo-props\x3d"serializeIfFalse:false,label:\'${i18nArcGIS.contInfo.FetCatDesc.incWithDS}\'"\x3e\r\n          \x3c/div\x3e    \r\n        \x3c/div\x3e        \r\n        \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/OpenElement"\r\n          data-dojo-props\x3d"target:\'catLang\',minOccurs:0,maxOccurs:\'unbounded\',label:\'${i18nArcGIS.codelist.LanguageCode}\'"\x3e\r\n          \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/types/arcgis/common/LanguageCode"\x3e\x3c/div\x3e\r\n          \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/types/arcgis/common/CountryCode"\x3e\x3c/div\x3e\r\n          \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/types/arcgis/common/CharSetCd"\x3e\x3c/div\x3e\r\n        \x3c/div\x3e\r\n      \x3c/div\x3e\r\n      \r\n      \x3c!-- feature types --\x3e\r\n      \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/Section"\r\n        data-dojo-props\x3d"showHeader:false,label:\'${i18nArcGIS.contInfo.FetCatDesc.section.featureTypes}\'"\x3e\r\n        \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/OpenElement"\r\n          data-dojo-props\x3d"target:\'catFetTyps\',minOccurs:0,maxOccurs:\'unbounded\',label:\'${i18nArcGIS.contInfo.FetCatDesc.catFetTyps.caption}\'"\x3e\r\n          \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/OpenElement"\r\n            data-dojo-props\x3d"target:\'genericName\',minOccurs:0,preferOpen:true,label:\'${i18nArcGIS.contInfo.FetCatDesc.catFetTyps.genericName}\'"\x3e\r\n            \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/InputText"\x3e\x3c/div\x3e\r\n            \x3cdiv style\x3d"margin-top: 8px;"\x3e\x3c/div\x3e\r\n            \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/Attribute"\r\n              data-dojo-props\x3d"target:\'codeSpace\',noIndent:true,minOccurs:0,preferOpen:true,label:\'${i18nArcGIS.contInfo.FetCatDesc.catFetTyps.codeSpace}\'"\x3e\r\n            \x3c/div\x3e            \r\n          \x3c/div\x3e          \r\n        \x3c/div\x3e\r\n      \x3c/div\x3e\r\n      \r\n      \x3c!-- citation --\x3e\r\n      \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/Section"\r\n        data-dojo-props\x3d"showHeader:false,label:\'${i18nArcGIS.contInfo.FetCatDesc.section.citation}\'"\x3e\r\n        \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/form/Element"\r\n          data-dojo-props\x3d"target:\'catCitation\',minOccurs:1,maxOccurs:\'unbounded\',label:\'${i18nArcGIS.contInfo.FetCatDesc.catCitation}\'"\x3e\r\n          \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/types/arcgis/citation/CitationElements"\x3e\x3c/div\x3e\r\n        \x3c/div\x3e\r\n      \x3c/div\x3e\r\n      \r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e'}});
define("esri/dijit/metadata/types/arcgis/content/FeatureCatalogue","dojo/_base/declare dojo/_base/lang dojo/has ../../../../../kernel ../../../base/Descriptor dojo/text!./templates/FeatureCatalogue.html ../common/LanguageCode ../common/CountryCode ../common/CharSetCd ../citation/CitationElements".split(" "),function(a,b,c,d,e,f){a=a(e,{templateString:f});c("extend-esri")&&b.setObject("dijit.metadata.types.arcgis.content.FeatureCatalogue",a,d);return a});