local Tunnel = module("vrp","lib/Tunnel")
local Proxy = module("vrp","lib/Proxy")
vRP = Proxy.getInterface("vRP")
vRPNserver = Tunnel.getInterface("haxx_cmuni")

-----------------------------------------------------------------------------------------------------------------------------------------
-- FUNCTION
-----------------------------------------------------------------------------------------------------------------------------------------
local menuactive = false
function ToggleActionMenu()
	menuactive = not menuactive
	if menuactive then
		SetNuiFocus(true,true)
		TransitionToBlurred(1000)
		SendNUIMessage({ showmenu = true })
	else
		SetNuiFocus(false)
		TransitionFromBlurred(1000)
		SendNUIMessage({ hidemenu = true })
	end
end
-----------------------------------------------------------------------------------------------------------------------------------------
-- BUTTON
-----------------------------------------------------------------------------------------------------------------------------------------
RegisterNUICallback("ButtonClick",function(data,cb)
	if data == "fechar" then
 		ToggleActionMenu()
 	end
end)

RegisterNUICallback("finalizando",function(data)
	local carrinho = data.cart
	TriggerServerEvent("haxx-compramuni", carrinho)
end)
-----------------------------------------------------------------------------------------------------------------------------------------
-- LOCAL DE ONDE HAVERA VENDA DE MUNI
-----------------------------------------------------------------------------------------------------------------------------------------
local haxxmuni = {

	{ 46.63,-1749.7,29.64 } ---LOCALIZACAO ALTERAVEL 
}

RegisterCommand('haxxmuni',function(source,args)
	SetNuiFocus(false,false)
	for _,mark in pairs(haxxmuni) do
		local ped = PlayerPedId()
		local x,y,z = table.unpack(mark)
		local distance = GetDistanceBetweenCoords(GetEntityCoords(PlayerPedId()),x,y,z,true)
		if distance <= 1.8 then
			ToggleActionMenu()
		end
	end
end)

RegisterKeyMapping("haxxmuni", "Haxx: Muni", "keyboard", "E")


-----------------------------------------------
------ BLIP 
-----------------------------------------------
CreateThread(function()
	while true do
		Citizen.Wait(5)
		local ped = PlayerPedId()
		local player = GetEntityCoords(ped)
		local blip = vector3(46.65,-1749.67,29.64)
		local distancia = #(player - blip)
		if distancia < 3 then
			DrawMarker(27, blip.x, blip.y, blip.z, 0, 0, 0, 0, 0, 0, 0.6, 0.6, 0.6, 105, 105, 105, 255, 0, 0, 2, 1)
			if IsControlJustPressed(0, 38) then
			end
		end
	end
end)

---------------------
--- LOCALIZACAO DAS VENDAS POR COMANDO
--------------------
local marcacoes = {
    { 46.68,-1749.7,29.64,119,40,"Vendas de Muni N:1",0.7 },

}
local blips = {}
local haxx = false
RegisterCommand("locmuni",function(source,args)
    haxx = not haxx

    if haxx then
        TriggerEvent("Notify","aviso","Adicionado as localizacoes de vendas de muni",3000)
        for k,v in pairs(haxxmuni) do
            blips[k] = AddBlipForCoord(v[1],v[2],v[3])
            SetBlipSprite(blips[k],v[4])
            SetBlipColour(blips[k],v[5])
            SetBlipScale(blips[k],v[7])
            SetBlipAsShortRange(blips[k],true)
            BeginTextCommandSetBlipName("STRING")
            AddTextComponentString(v[6])
            EndTextCommandSetBlipName(blips[k])
        end
    else
        TriggerEvent("Notify","aviso","Localizacoes retiradas de seu mapa",3000)
        for k,v in pairs(blips) do
            if DoesBlipExist(v) then
                RemoveBlip(v)
            end
        end
        blips = {}
    end
end)
