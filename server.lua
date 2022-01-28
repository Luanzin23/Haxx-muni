local Tunnel = module("vrp","lib/Tunnel")
local Proxy = module("vrp","lib/Proxy")
vRP = Proxy.getInterface("vRP")

-----------------------------------------------------------------------------------------------------------------------------------------
-- COMPRAR
-----------------------------------------------------------------------------------------------------------------------------------------
RegisterServerEvent("haxx-compramuni")
AddEventHandler("haxx-compramuni",function(carrinho)
	local source = source
	local user_id = vRP.getUserId(source)
	local total = 0
	local peso = 0
	local temitem = false

	for k, v in pairs(carrinho) do
		local price = parseInt(v.price)
		local qt = parseInt(v.qt)
		if qt >= 1 then
			temitem = true
		end
		total = total + price*qt  
		peso = peso + (vRP.getItemWeight(v.set)) * qt
	end
	if temitem == true then
		if vRP.getInventoryWeight(user_id)+peso <= vRP.getInventoryMaxWeight(user_id) then
			if vRP.tryFullPayment(user_id,parseInt(total)) then
				for k, v in pairs(carrinho) do
					local item = v.set
					local quantidade = parseInt(v.qt)
					vRP.giveInventoryItem(user_id, item, quantidade)
				end			
				TriggerClientEvent("Notify",source,"sucesso","Compra realizada com sucesso!")
			else 
				TriggerClientEvent("Notify",source,"negado","Dinheiro Insuficiente.")
			end
		else
			TriggerClientEvent("Notify",source,"negado","Espaço Insuficiente.")
		end
	else 
		TriggerClientEvent("Notify",source,"aviso","O seu carrinho esta vazio.")
	end
end)

print('O SCRIPT DE VENDA DE MUNI FOI INICIADO/REINICADO! SUP COM: Haxx#4562 ')